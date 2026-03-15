#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

source "$ROOT_DIR/environments/local.env"

PASS=0
FAIL=0

assert_status() {
  local label="$1"
  local expected="$2"
  local actual
  actual=$(eval "$3" --print=h 2>/dev/null | grep "^HTTP" | awk '{print $2}')
  if [ "$actual" = "$expected" ]; then
    echo "  ✓ $label ($actual)"
    ((PASS++))
  else
    echo "  ✗ $label — esperado $expected, obtenido ${actual:-sin respuesta}"
    ((FAIL++))
  fi
}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     BancoUdea — Smoke Test               ║"
echo "╚══════════════════════════════════════════╝"

echo ""
echo "── Clientes ─────────────────────────────────"
assert_status "GET /customers"               "200" \
  "http GET $BASE_URL/customers"

assert_status "POST /customers (cuenta 1)"   "200" \
  "http POST $BASE_URL/customers firstName=Ana lastName=Gomez accountNumber=111001 balance:=500000"

assert_status "POST /customers (cuenta 2)"   "200" \
  "http POST $BASE_URL/customers firstName=Carlos lastName=Perez accountNumber=111002 balance:=100000"

assert_status "GET /customers/account/111001" "200" \
  "http GET $BASE_URL/customers/account/111001"

echo ""
echo "── Transferencias ───────────────────────────"
KEY1=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)
assert_status "POST /transactions (nueva)"   "200" \
  "http POST $BASE_URL/transactions senderAccountNumber=111001 receiverAccountNumber=111002 amount:=10000 idempotencyKey=$KEY1"

assert_status "POST /transactions (idempotente)" "200" \
  "http POST $BASE_URL/transactions senderAccountNumber=111001 receiverAccountNumber=111002 amount:=10000 idempotencyKey=$KEY1"

assert_status "GET /transactions/111001"     "200" \
  "http GET $BASE_URL/transactions/111001"

echo ""
echo "── Errores esperados ────────────────────────"
assert_status "GET /customers/999 → 404"     "404" \
  "http GET $BASE_URL/customers/999"

assert_status "DELETE cliente con saldo → 422" "422" \
  "http DELETE $BASE_URL/customers/1"

assert_status "Transfer saldo insuficiente → 422" "422" \
  "http POST $BASE_URL/transactions senderAccountNumber=111001 receiverAccountNumber=111002 amount:=999999999 idempotencyKey=$(cat /proc/sys/kernel/random/uuid 2>/dev/null || uuidgen)"

echo ""
echo "══════════════════════════════════════════"
printf   "  Resultado: %d pasaron / %d fallaron\n" "$PASS" "$FAIL"
echo "══════════════════════════════════════════"
echo ""
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
