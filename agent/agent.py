"""Loop agent: model memutuskan -> kode menjalankan tool -> hasil dikembalikan -> ulang sampai jawaban final."""
from google import genai
from google.genai import types

import config
from prompts import SYSTEM_PROMPT
from tools import TOOL_FUNCTIONS, TOOL_MAP


def run_tool(name: str, args: dict) -> dict:
    """Jalankan tool by name. Tidak pernah raise: error dikirim balik ke model supaya bisa memperbaiki diri."""
    fn = TOOL_MAP.get(name)
    if fn is None:
        return {"success": False, "error": f"Tool '{name}' tidak ada. Tersedia: {list(TOOL_MAP)}"}
    try:
        return fn(**args)
    except TypeError as e:  # argumen salah dari model
        return {"success": False, "error": f"Argumen tidak valid: {e}"}
    except Exception as e:
        return {"success": False, "error": f"Error tak terduga di tool {name}: {e}"}


class WindStoreAgent:
    """Satu instance = satu percakapan (ingat konteks antar pertanyaan). Pakai reset() untuk mulai baru."""

    def __init__(self, verbose: bool = True, on_tool_call=None):
        if not config.GEMINI_API_KEY:
            raise RuntimeError("GEMINI_API_KEY belum diisi di .env")
        self.client = genai.Client(api_key=config.GEMINI_API_KEY)
        self.verbose = verbose
        self.on_tool_call = on_tool_call  # fungsi(name, args, result) -> dipakai UI
        self.gen_config = types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            tools=TOOL_FUNCTIONS,
            temperature=config.TEMPERATURE,
            # kita jalankan loop sendiri supaya kelihatan tiap langkahnya
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
        )
        self.reset()

    def reset(self):
        self.contents: list[types.Content] = []

    def _log(self, msg: str):
        if self.verbose:
            print(msg)

    def ask(self, user_prompt: str) -> str:
        self.contents.append(types.Content(role="user", parts=[types.Part(text=user_prompt)]))

        for step in range(1, config.MAX_AGENT_STEPS + 1):
            response = self.client.models.generate_content(
                model=config.GEMINI_MODEL, contents=self.contents, config=self.gen_config
            )
            calls = response.function_calls
            if not calls:
                answer = response.text or "(model tidak memberi jawaban)"
                self.contents.append(response.candidates[0].content)
                return answer

            # simpan permintaan tool APA ADANYA (menjaga thought signature model)
            self.contents.append(response.candidates[0].content)

            result_parts = []
            for call in calls:
                args = dict(call.args or {})
                self._log(f"[step {step}] tool: {call.name}({args})")
                result = run_tool(call.name, args)
                self._log(f"          -> success={result.get('success')}")
                if self.on_tool_call:
                    self.on_tool_call(call.name, args, result)
                result_parts.append(
                    types.Part.from_function_response(name=call.name, response={"result": result})
                )
            self.contents.append(types.Content(role="user", parts=result_parts))

        return f"Maaf, saya belum bisa menyelesaikan ini dalam {config.MAX_AGENT_STEPS} langkah."
