const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5001;

// --- NEURAL ENGINE ROUTE ---
app.post('/analyze', async (req, res) => {
  try {
    const { prompt, usage_count, is_student } = req.body;
    console.log(`📡 Neural request received: ${prompt} | Usage: ${usage_count} | Student: ${is_student}`);

    // LOGIC: Usage Limits & Student Verification
    if (usage_count < 2) {
      // Allow execution (Proceed to Gemini)
    } else if (usage_count >= 2 && !is_student) {
      return res.json({ analysis: "Daily limit reached. Please verify your Student ID to unlock 10 more free scans or upgrade to Sentinel Pro." });
    } else if (is_student && usage_count < 10) {
      // Allow execution (Proceed to Gemini)
    } else if (is_student && usage_count >= 10) {
      return res.json({ analysis: "Student limit reached. Upgrade to Pro for unlimited Anti-Gravity and Neural insights." });
    }

    // DEBUG: Check key status
    console.log("DEBUG: Key status:", process.env.GEMINI_API_KEY ? "Present" : "Missing", "Length:", process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);

    // Check if key is present and appears valid
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.includes('AIzaSy')) {
      // API Key test logic
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const promptConfig = `
ROLE: You are a Quant Strategist specialized in 'Defensive Alpha' for the Indian Stock Market.
OBJECTIVE: Evaluate the "Anti-Gravity" potential of the asset: "${prompt}".

CONTEXT: An "Anti-Gravity" stock is one that stays resilient or moves inversely when the Nifty 50 or Sensex faces a major drawdown.

ANALYSIS PARAMETERS:
1. GRAVITY DEFIANCE SCORE (1-10): 10 = Total Decoupling/Safe Haven. 1 = High Loop with Crashes.
   -> IMPORTANT: Map this to 'riskScore' as follows: riskScore = (11 - Gravity Defiance Score).
   -> Example: High Resilience (10) = Risk Score 1 (Low Risk).
2. BETA & CORRELATION: Assess Low-Beta or Negative Correlation.
3. RESILIENCE FACTOR: Identify fundamental moats (Cash, Govt Backing, Non-Cyclical).
4. SAFE HAVEN RATING: Buy/Hold/Avoid.

[CRITICAL INSTRUCTION]: You MUST use your search capabilities to find the most recent news (last 24-48h) for this ticker. 
- If recent news exists (e.g., earnings, SEBI rulings), explicitly reference it in the 'Analysis' or 'Black Swan' sections.
- If no news, rely on historical volatility.
- THIS IS A "LIVE" ANALYSIS. DO NOT USE STATIC DATA.

OUTPUT FORMAT: Return ONLY a raw JSON object (no markdown formatting). 
Structure:
{
  "riskScore": (Integer 1-10, calculated as 11 - GravityScore),
  "riskLevel": (String: "Low", "Moderate", "Critical"),
  "signal": (String: "Buy", "Hold", "Avoid"),
  "blackSwanRisks": [(String, max 6 words, potential vulnerabilities)],
  "hedgingStrategies": [(String, max 6 words, resilience factors/moats)],
  "analysisSummary": (String, max 2 sentences. Focus on Beta, Correlation, and Historical Resilience during crashes like 2008/2020)
}
`;
      const result = await model.generateContent(promptConfig);
      const response = await result.response;
      let text = response.text();
      console.log("✅ Gemini Response Generated");
      console.log("DEBUG: Response Preview:", text.substring(0, 200));

      // Clean the response: Extract JSON object
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        text = jsonMatch[0];
      } else {
        // Fallback cleaning if no braces found (unlikely but safe)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      res.json({ analysis: text });
    } else {
      console.error("❌ Invalid or Missing API Key:", process.env.GEMINI_API_KEY ? "Key present but invalid format" : "Key missing");
      throw new Error("API_KEY_INVALID_OR_MISSING");
    }
  } catch (error) {
    console.error("❌ Engine Error:", error.message);
    if (error.response) {
      console.error("API Error Details:", JSON.stringify(error.response, null, 2));
    }
    console.error(error.stack);

    // TEMPORARY: Return error details to frontend for debugging
    res.status(500).json({
      analysis: `[SYSTEM_ERROR]: ${error.message} \n Check backend console for details.`,
      status: "Neural Engine Failed",
      error: error.message
    });
  }
});

app.get('/', (req, res) => res.send('Sentinel Quant Backend is Live!'));

app.listen(PORT, () => {
  console.log('-------------------------------------------');
  console.log(`🚀 Sentinel Quant Backend is Live!`);
  console.log(`📡 Neural Engine Cluster: http://localhost:${PORT}`);
  console.log('-------------------------------------------');
});