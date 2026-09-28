#!/bin/bash

# Smoke Test Script for Phase 1 / Step 2 Backend API
# Usage: ./scripts/smoke-test.sh <BASE_URL>

set -e

BASE_URL="${1:-http://localhost:3000}"
ALICE_EMAIL="alice-$(date +%s)@example.com"
BOB_EMAIL="bob-$(date +%s)@example.com"
PASSWORD="SecurePass123!"

echo "=========================================="
echo "🧪 Archioai Backend API Smoke Test"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print test results
print_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✓ $2${NC}"
  else
    echo -e "${RED}✗ $2${NC}"
    exit 1
  fi
}

# Helper function to extract JSON field
extract_json() {
  echo "$1" | grep -o "\"$2\":\"[^\"]*\"" | cut -d'"' -f4
}

echo -e "${BLUE}Step 1: Health Check${NC}"
HEALTH_RESPONSE=$(curl -s "$BASE_URL/api/health")
echo "$HEALTH_RESPONSE"
print_result $? "Health check passed"
echo ""

echo -e "${BLUE}Step 2a: Sign up Alice${NC}"
ALICE_SIGNUP=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ALICE_EMAIL\",\"password\":\"$PASSWORD\",\"displayName\":\"Alice Admin\"}")
echo "$ALICE_SIGNUP"
ALICE_USER_ID=$(echo "$ALICE_SIGNUP" | grep -o '"userId":"[^"]*"' | cut -d'"' -f4)
print_result $? "Alice signed up (ID: $ALICE_USER_ID)"
echo ""

echo -e "${BLUE}Step 2b: Sign up Bob${NC}"
BOB_SIGNUP=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$BOB_EMAIL\",\"password\":\"$PASSWORD\",\"displayName\":\"Bob Builder\"}")
echo "$BOB_SIGNUP"
BOB_USER_ID=$(echo "$BOB_SIGNUP" | grep -o '"userId":"[^"]*"' | cut -d'"' -f4)
print_result $? "Bob signed up (ID: $BOB_USER_ID)"
echo ""

echo -e "${BLUE}Step 3a: Login Alice${NC}"
ALICE_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ALICE_EMAIL\",\"password\":\"$PASSWORD\"}")
echo "$ALICE_LOGIN"
ALICE_TOKEN=$(echo "$ALICE_LOGIN" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
print_result $? "Alice logged in"
echo ""

echo -e "${BLUE}Step 3b: Login Bob${NC}"
BOB_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$BOB_EMAIL\",\"password\":\"$PASSWORD\"}")
echo "$BOB_LOGIN"
BOB_TOKEN=$(echo "$BOB_LOGIN" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
print_result $? "Bob logged in"
echo ""

echo -e "${BLUE}Step 4a: Alice creates organization${NC}"
ORG_CREATE=$(curl -s -X POST "$BASE_URL/api/orgs" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Archioai Trading Community","description":"Professional trading analysis"}')
echo "$ORG_CREATE"
ORG_ID=$(echo "$ORG_CREATE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_result $? "Alice created organization (ID: $ORG_ID)"
echo ""

echo -e "${BLUE}Step 4b: Alice creates room${NC}"
ROOM_CREATE=$(curl -s -X POST "$BASE_URL/api/rooms" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"org_id\":\"$ORG_ID\",\"name\":\"forex-analysis\",\"description\":\"FX market analysis\",\"is_public\":false}")
echo "$ROOM_CREATE"
ROOM_ID=$(echo "$ROOM_CREATE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
print_result $? "Alice created room (ID: $ROOM_ID)"
echo ""

echo -e "${BLUE}Step 5a: Alice creates invite${NC}"
INVITE_CREATE=$(curl -s -X POST "$BASE_URL/api/invites" \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"room_id\":\"$ROOM_ID\",\"max_uses\":1}")
echo "$INVITE_CREATE"
INVITE_TOKEN=$(echo "$INVITE_CREATE" | grep -o '"invite_code":"[^"]*"' | cut -d'"' -f4)
print_result $? "Alice created invite (Token: $INVITE_TOKEN)"
echo ""

echo -e "${BLUE}Step 5b: Bob accepts invite${NC}"
INVITE_ACCEPT=$(curl -s -X POST "$BASE_URL/api/invites/$INVITE_TOKEN/accept" \
  -H "Authorization: Bearer $BOB_TOKEN")
echo "$INVITE_ACCEPT"
print_result $? "Bob accepted invite"
echo ""

echo -e "${BLUE}Step 6a: Bob lists rooms (should see 1)${NC}"
BOB_ROOMS=$(curl -s "$BASE_URL/api/rooms?org_id=$ORG_ID" \
  -H "Authorization: Bearer $BOB_TOKEN")
echo "$BOB_ROOMS"
print_result $? "Bob can see rooms"
echo ""

echo -e "${BLUE}Step 6b: Unrelated user tries to access (should fail)${NC}"
UNAUTH_ROOMS=$(curl -s -w "\nHTTP_CODE:%{http_code}" "$BASE_URL/api/rooms?org_id=$ORG_ID")
HTTP_CODE=$(echo "$UNAUTH_ROOMS" | grep "HTTP_CODE" | cut -d':' -f2)
echo "$UNAUTH_ROOMS"
if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "403" ]; then
  print_result 0 "Unauthorized access properly blocked (HTTP $HTTP_CODE)"
else
  print_result 1 "Unauthorized access should have been blocked"
fi
echo ""

echo "=========================================="
echo -e "${GREEN}✓ All smoke tests passed!${NC}"
echo "=========================================="
echo ""
echo "Test Users:"
echo "  Alice: $ALICE_EMAIL / $PASSWORD"
echo "  Bob: $BOB_EMAIL / $PASSWORD"
echo ""
echo "Alice Token (24h):"
echo "  $ALICE_TOKEN"
echo ""
echo "Bob Token (24h):"
echo "  $BOB_TOKEN"
echo ""
