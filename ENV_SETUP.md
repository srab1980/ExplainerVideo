# Environment Setup

## Option 1: Use OpenAI API (Costs Money)

1. Go to https://platform.openai.com/api-keys
2. Create an account (separate from ChatGPT Plus)
3. Add billing information
4. Create an API key
5. Add it to `.env.local`:

```bash
OPENAI_API_KEY=sk-your-actual-key-here
```

**Cost:** ~$0.0001-0.0005 per scene generation (very cheap but not free)

---

## Option 2: Test Without AI (Free - Manual Mode)

The app works without AI! You can:
- Manually add scenes
- Manually choose icons from 150+ available
- Use all layouts and animations
- Everything works except "Generate Storyboard" button

To use the app in manual mode:
1. Click "Add Scene" button in the timeline
2. Edit the scene text manually
3. Click the illustration tab and manually select icons
4. Preview animations and layouts

---

## Option 3: Mock AI Mode (Free - For Testing)

I can create a mock AI endpoint that returns fake data for testing.
This will make the "Generate Storyboard" button work without costs.

Would you like me to implement this?
