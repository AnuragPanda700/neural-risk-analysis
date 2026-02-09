const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // We use this just to get the client, but listModels is on genAI? No, it's NOT.
        // Actually, listModels is not directly on genAI instance in the node SDK?
        // Wait, the SDK doesn't always expose listModels easily?

        // Let's rely on documentation intuition. 
        // Actually, I can just try to use 'gemini-pro' (1.0) which is standard, or 'gemini-1.5-flash-latest'

        // But I want to list them if possible. 
        // It seems the SDK might handle this differently.

        // Let's just try to generate content with 'gemini-pro' as a test in this script.

        console.log("Testing gemini-pro...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await modelPro.generateContent("Hello");
        console.log("gemini-pro success:", result.response.text());
    } catch (error) {
        console.error("gemini-pro failed:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await modelFlash.generateContent("Hello");
        console.log("gemini-1.5-flash success:", result.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash failed:", error.message);
    }

    try {
        console.log("Testing gemini-1.5-flash-001...");
        const modelFlash001 = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await modelFlash001.generateContent("Hello");
        console.log("gemini-1.5-flash-001 success:", result.response.text());
    } catch (error) {
        console.error("gemini-1.5-flash-001 failed:", error.message);
    }
}

listModels();
