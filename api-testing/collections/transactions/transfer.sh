#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../environments/local.env"

IDEMPOTENCY_KEY=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)

http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=50000.00 \
  idempotencyKey="$IDEMPOTENCY_KEY"
