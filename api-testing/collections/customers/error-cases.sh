#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../environments/local.env"

echo ""
echo "══════════════════════════════════════════"
echo "  404 — Cliente inexistente"
echo "══════════════════════════════════════════"
http GET "$BASE_URL/customers/999"

echo ""
echo "══════════════════════════════════════════"
echo "  400 — id inválido (no positivo)"
echo "══════════════════════════════════════════"
http GET "$BASE_URL/customers/0"

echo ""
echo "══════════════════════════════════════════"
echo "  400 — accountNumber duplicado en update"
echo "══════════════════════════════════════════"
http PUT "$BASE_URL/customers/1" \
  firstName="Ana" \
  lastName="Gómez" \
  accountNumber="654321" \
  balance:=500000.00

echo ""
echo "══════════════════════════════════════════"
echo "  422 — Eliminar cliente con saldo > 0"
echo "══════════════════════════════════════════"
http DELETE "$BASE_URL/customers/1"

echo ""
echo "══════════════════════════════════════════"
echo "  400 — Validación DTO: balance negativo"
echo "══════════════════════════════════════════"
http POST "$BASE_URL/customers" \
  firstName="Test" \
  lastName="User" \
  accountNumber="999888" \
  balance:=-100
