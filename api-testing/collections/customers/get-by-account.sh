#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../requests/customers.sh"
customers_get_by_account "${1:-$ACCOUNT_ORIGIN}"
