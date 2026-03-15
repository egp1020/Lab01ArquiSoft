#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../environments/local.env"

FIXED_KEY="a1b2c3d4-0001-0001-0001-000000000001"

echo ""
echo "══════════════════════════════════════════"
echo "  Intento 1 — debe crear la transacción"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=50000.00 \
  idempotencyKey="$FIXED_KEY"

echo ""
echo "══════════════════════════════════════════"
echo "  Intento 2 — misma key, debe retornar"
echo "  la transacción original sin modificar"
echo "  balances."
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=50000.00 \
  idempotencyKey="$FIXED_KEY"
