#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

PORT="${PORT:-8080}"

cleanup() {
  docker compose down --remove-orphans 2>/dev/null || true
}

trap cleanup EXIT INT TERM

if ! command -v docker >/dev/null 2>&1; then
  echo "Brak polecenia: docker" >&2
  exit 1
fi

if ! command -v ngrok >/dev/null 2>&1; then
  echo "Brak polecenia: ngrok" >&2
  echo "Instalacja: https://ngrok.com/download lub brew install ngrok/ngrok/ngrok" >&2
  exit 1
fi

echo "Budowanie i uruchamianie kontenera (port ${PORT})..."
docker compose up -d --build

echo "Oczekiwanie na aplikację pod http://127.0.0.1:${PORT}/ ..."
for _ in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:${PORT}/products" >/dev/null 2>&1; then
    echo "Aplikacja odpowiada."
    break
  fi
  sleep 1
done

if ! curl -sf "http://127.0.0.1:${PORT}/products" >/dev/null 2>&1; then
  echo "Timeout: aplikacja nie wystartowała na porcie ${PORT}." >&2
  docker compose logs --tail 50 web >&2 || true
  exit 1
fi

echo "Uruchamianie tunelu ngrok -> localhost:${PORT} (Ctrl+C kończy działanie i zatrzymuje kontenery)."
ngrok http "${PORT}"
