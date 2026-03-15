#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../requests/customers.sh"
customers_get "${1:-$CUSTOMER_ID}"
