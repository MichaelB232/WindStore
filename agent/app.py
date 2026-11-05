"""Chat UI. Jalankan:  streamlit run ui_app.py"""

import json

import streamlit as st

import config
from agent import WindStoreAgent

st.set_page_config(page_title="WindStore Assistant", page_icon="💻")
st.title("💻 WindStore Assistant")

# --- state: 1 agent + 1 riwayat tampilan per sesi browser ---
if "agent" not in st.session_state:
    st.session_state.tool_log = (
        []
    )  # tool yang dipanggil untuk pertanyaan yang sedang diproses
    st.session_state.agent = WindStoreAgent(
        verbose=False,
        on_tool_call=lambda n, a, r: st.session_state.tool_log.append((n, a, r)),
    )
    st.session_state.messages = []  # [{"role", "content", "tools"}]


def render_tools(tools):
    for name, args, result in tools:
        icon = "✅" if result.get("success") else "⚠️"
        with st.expander(
            f"{icon} {name}({', '.join(f'{k}={v!r}' for k, v in args.items())})"
        ):
            st.json(result)


with st.sidebar:
    st.caption(f"API: {config.API_BASE_URL}")
    st.caption(f"Model: {config.GEMINI_MODEL}")
    show_tools = st.toggle("Tampilkan tool yang dipanggil", value=True)
    if st.button("Percakapan baru"):
        st.session_state.agent.reset()
        st.session_state.messages = []
        st.rerun()
    st.markdown("**Coba tanya:**")
    examples = [
        "Tampilkan semua produk Samsung",
        "Laptop gaming di bawah 22 juta, urutkan termurah",
        "Detail dan review ASUS ROG Strix G16",
        "Beli 3 unit ROG Strix G16 versi 32GB / 2TB diskon 10%, totalnya?",
        "Rata-rata harga laptop Gaming?",
    ]
    clicked = None
    for ex in examples:
        if st.button(ex, use_container_width=True):
            clicked = ex

for m in st.session_state.messages:
    with st.chat_message(m["role"]):
        if show_tools and m.get("tools"):
            render_tools(m["tools"])
        st.markdown(m["content"])

prompt = st.chat_input("Tanya soal produk WindStore...") or clicked
if prompt:
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    with st.chat_message("assistant"):
        st.session_state.tool_log = []
        with st.spinner("Mikir..."):
            try:
                answer = st.session_state.agent.ask(prompt)
            except Exception as e:  # key salah, kuota habis, jaringan, dll
                answer = f"⚠️ Error: {e}"
        tools = list(st.session_state.tool_log)
        if show_tools:
            render_tools(tools)
        st.markdown(answer)
    st.session_state.messages.append(
        {"role": "assistant", "content": answer, "tools": tools}
    )
