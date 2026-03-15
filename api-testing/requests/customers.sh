#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

source "$ROOT_DIR/environments/local.env"

customers_list() {
  http GET "$BASE_URL/customers"
}

customers_get() {
  local id=${1:?'Uso: customers_get <id>'}
  http GET "$BASE_URL/customers/$id"
}

customers_get_by_account() {
  local account=${1:?'Uso: customers_get_by_account <accountNumber>'}
  http GET "$BASE_URL/customers/account/$account"
}

customers_create() {
  local body=${1:?'Uso: customers_create <path/to/body.json>'}
  http POST "$BASE_URL/customers" < "$body"
}

customers_update() {
  local id=${1:?'Uso: customers_update <id> <path/to/body.json>'}
  local body=${2:?'Uso: customers_update <id> <path/to/body.json>'}
  http PUT "$BASE_URL/customers/$id" < "$body"
}

customers_delete() {
  local id=${1:?'Uso: customers_delete <id>'}
  http DELETE "$BASE_URL/customers/$id"
}
