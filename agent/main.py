"""CLI sederhana: python main.py"""
from agent import WindStoreAgent

if __name__ == "__main__":
    agent = WindStoreAgent(verbose=True)
    print("WindStore Assistant (ketik 'exit' untuk keluar, 'reset' untuk mulai ulang)\n")
    while True:
        q = input("Kamu: ").strip()
        if q.lower() in {"exit", "quit"}:
            break
        if q.lower() == "reset":
            agent.reset()
            print("(percakapan di-reset)\n")
            continue
        if q:
            print(f"\nAsisten: {agent.ask(q)}\n")
