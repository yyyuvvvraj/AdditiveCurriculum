# 🤖 Chatbot Troubleshooting Guide

## ✅ What I Fixed:

1. **Better Error Messages** - The chatbot now shows actual error details instead of generic "Failed to get response"
2. **Proper Error Handling** - API route now catches and returns detailed error messages
3. **Response Parsing** - Fixed potential issues with response parsing
4. **Client-side Logging** - Console errors now show the actual problem

## 🔍 Common Issues & Solutions:

### ❌ Issue: "Invalid OpenAI API key"
**Solution:**
1. Get API key from: https://platform.openai.com/account/api-keys
2. Verify it starts with `sk-proj-`
3. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-key-here
   ```
4. Restart dev server: `npm run dev`

### ❌ Issue: "Rate limited" 
**Solution:**
- You're sending too many requests to OpenAI
- Wait a few seconds and try again
- Check your OpenAI account for usage limits

### ❌ Issue: "Network error"
**Solution:**
- Check internet connection
- Verify API key is valid
- Try a simpler query first

### ❌ Issue: "Invalid response from OpenAI"
**Solution:**
- OpenAI API might be down
- Try again in a moment
- Check https://status.openai.com

## 🧪 How to Test:

### Method 1: Browser Console
1. Open Dashboard
2. Open DevTools (F12)
3. Go to Console tab
4. You'll see detailed error messages when chatbot fails

### Method 2: API Direct Test
```bash
curl -X POST http://localhost:3000/api/chatbot \
  -H "Content-Type: application/json" \
  -d '{"query":"How are the machines?"}'
```

### Method 3: Check Environment
```bash
# In terminal, verify .env.local has API key
grep "OPENAI_API_KEY" .env.local
```

## ✅ Verification Checklist:

- [ ] API key added to `.env.local` (starts with `sk-proj-`)
- [ ] Dev server restarted after adding key (`npm run dev`)
- [ ] Dashboard loads without errors
- [ ] Can open chatbot (💬 button bottom-right)
- [ ] Can send a test message
- [ ] Chatbot responds with actual text (not error)

## 📊 What the Chatbot Can Now Do:

With OpenAI integration, your chatbot can:
- Answer any maintenance-related question
- Understand natural language (context-aware)
- Provide recommendations based on machine data
- Calculate costs and schedules
- Give optimization tips
- Answer follow-up questions

## 🚀 Example Working Queries:

✅ "Which machines need urgent attention?"
✅ "What's the total maintenance cost for critical machines?"
✅ "How can we reduce equipment failures?"
✅ "Are we low on any spare parts?"
✅ "What should be my maintenance schedule?"
✅ "Why is machine MC-1001 critical?"
✅ "What's the average temperature of all machines?"

---

**If you still get errors:**
1. Check browser console (F12) for exact error message
2. Verify OPENAI_API_KEY in `.env.local`
3. Restart dev server
4. Try a fresh query
