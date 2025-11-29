#!/bin/bash
# Quick test script for chatbot API

echo "🧪 Testing Chatbot API..."
echo ""

# Check if .env.local has OPENAI_API_KEY
if grep -q "OPENAI_API_KEY=" .env.local; then
  echo "✅ OPENAI_API_KEY found in .env.local"
else
  echo "❌ OPENAI_API_KEY not found in .env.local"
  echo "Please add your OpenAI API key to .env.local"
  exit 1
fi

# Make a test API call
echo ""
echo "📨 Sending test query to /api/chatbot..."
echo ""

curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"query":"What is the status of the machines?"}' | jq .

echo ""
echo "✅ Test complete!"
