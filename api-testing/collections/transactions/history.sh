#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../environments/local.env"
http GET "$BASE_URL/transactions/${1:-$ACCOUNT_ORIGIN}"
