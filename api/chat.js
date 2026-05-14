// ─── Vercel Serverless Function — Gemini Proxy ───────────────────────────────
// API key yahan server pe safe rehti hai, frontend ko kabhi nahi milti

export default async function handler(req, res) {
  // CORS headers — sirf aapki website se requests allow karo
  res.setHeader("Access-Control-Allow-Origin", "https://www.qwetrumtechnologies.tech");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browser preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, system } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // API key Vercel Environment Variable se aati hai — kabhi expose nahi hoti
    const apiKey = process.env.gemini_api_key;

    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const contents = messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents,
        generationConfig: { maxOutputTokens: 800, temperature: 0.75 },
      }),
    });

    const data = await geminiRes.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, please try again.";
    return res.status(200).json({ reply });

  } catch (err) {
    console.error("QBot proxy error:", err);
    return res.status(500).json({ error: "Server error, please try again." });
  }
}
