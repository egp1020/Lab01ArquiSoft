#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../environments/local.env"

echo ""
echo "══════════════════════════════════════════"
echo "  400 — Misma cuenta origen y destino"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_ORIGIN" \
  amount:=1000.00 \
  idempotencyKey="$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)"

echo ""
echo "══════════════════════════════════════════"
echo "  404 — Cuenta origen no existe"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="000000" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=1000.00 \
  idempotencyKey="$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)"

echo ""
echo "══════════════════════════════════════════"
echo "  422 — Saldo insuficiente"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=999999999.00 \
  idempotencyKey="$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)"

echo ""
echo "══════════════════════════════════════════"
echo "  400 — Monto negativo (validación DTO)"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=-100.00 \
  idempotencyKey="$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)"

echo ""
echo "══════════════════════════════════════════"
echo "  400 — idempotencyKey faltante"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/transactions" \
  senderAccountNumber="$ACCOUNT_ORIGIN" \
  receiverAccountNumber="$ACCOUNT_DEST" \
  amount:=1000.00
