"""Tiny .env reader shared by the test scripts. ponytail: avoids a dotenv dep."""
from pathlib import Path


def load_env(path=None):
    path = path or (Path(__file__).resolve().parent / ".env")
    env = {}
    if path.exists():
        for line in path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env
