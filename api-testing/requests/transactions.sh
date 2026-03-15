#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

source "$ROOT_DIR/environments/local.env"

transfer_create() {
  local body=${1:?'Uso: transfer_create <path/to/body.json>'}
  http POST "$BASE_URL/transactions" < "$body"
}

transfer_history() {
  local account=${1:?'Uso: transfer_history <accountNumber>'}
  http GET "$BASE_URL/transactions/$account"
}
