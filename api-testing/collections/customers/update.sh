#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../requests/customers.sh"
ID="${1:-$CUSTOMER_ID}"
BODY="${2:-$ROOT_DIR/bodies/update-customer.json}"
customers_update "$ID" "$BODY"
