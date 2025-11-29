import { fetchMachines, fetchInventory } from "@/lib/api";

interface ChatbotRequest {
  query: string;
}

interface ChatbotResponse {
  response: string;
}

// Simple in-memory cache for responses (resets on server restart)
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let lastGeminiCallTime = 0;
const MIN_API_INTERVAL = 1000; // 1 second between API calls

/**
 * Chatbot API Handler using Gemini (primary)
 * Provides intelligent responses about maintenance, costs, and machine data
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const { query }: ChatbotRequest = await req.json();

    if (!query || typeof query !== "string") {
      return Response.json(
        { response: "Please provide a valid query." },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = query.toLowerCase().trim();
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("✓ Using cached response for:", query);
      return Response.json({ response: cached.response });
    }

    // Fetch current machine and inventory data
    const machines = await fetchMachines();
    const inventory = await fetchInventory();

    // Prepare system context with current facility data
    const systemPrompt = buildSystemPrompt(machines, inventory);

    let response: string;
    let apiUsed = "none";

    // Try Gemini first (primary)
    const timeSinceLastGemini = Date.now() - lastGeminiCallTime;
    if (timeSinceLastGemini >= MIN_API_INTERVAL) {
      try {
        console.log("🔷 Calling Gemini API...");
        response = await callGemini(query, systemPrompt);
        lastGeminiCallTime = Date.now();
        apiUsed = "gemini";
        responseCache.set(cacheKey, { response, timestamp: Date.now() });
      } catch (geminiError) {
        console.warn("🔷 Gemini failed:", geminiError);
        // Use offline mode as fallback
        response = getFallbackResponse(query, machines, inventory);
        apiUsed = "offline";
      }
    } else {
      // Rate limited, use offline mode
      response = getFallbackResponse(query, machines, inventory);
      apiUsed = "offline";
    }

    console.log(`Response generated using: ${apiUsed}`);
    return Response.json({ response });
  } catch (error) {
    console.error("Chatbot API error:", error);

    let errorMessage = "Sorry, I encountered an error processing your request.";

    if (error instanceof Error) {
      if (error.message.includes("⚠️") || error.message.includes("❌") || error.message.includes("⏳")) {
        errorMessage = error.message;
      } else if (error.message.includes("API key")) {
        errorMessage = "⚠️ API key not configured. Please set GEMINI_API_KEY in .env.local";
      } else if (error.message.includes("401")) {
        errorMessage = "❌ Authentication failed. Invalid API key.";
      } else if (error.message.includes("fetch")) {
        errorMessage = "❌ Network error. Please check your internet connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }

    return Response.json({ response: errorMessage }, { status: 500 });
  }
}

/**
 * Call Google Gemini API
 */
async function callGemini(userQuery: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes("your-gemini-api-key")) {
    throw new Error("⚠️ GEMINI_API_KEY not configured. Get one from: https://ai.google.dev/");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser Query: ${userQuery}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", {
        status: response.status,
        error: data.error,
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("❌ Invalid Gemini API key.");
      } else if (response.status === 429) {
        throw new Error("⏳ Gemini rate limited.");
      } else if (data.error?.message) {
        throw new Error(`Gemini Error: ${data.error.message}`);
      } else {
        throw new Error(`Gemini API returned status ${response.status}`);
      }
    }

    const messageContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!messageContent) {
      console.error("Invalid Gemini response:", data);
      throw new Error("❌ No content from Gemini.");
    }

    return messageContent;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("❌ Failed to call Gemini API.");
  }
}

/**
 * Intelligent fallback response generator (offline mode)
 * Generates contextual responses with dynamic data, not generic patterns
 */
function getFallbackResponse(
  query: string,
  machines: any[],
  inventory: any[]
): string {
  const lowerQuery = query.toLowerCase();
  
  // Always fetch current data for accurate responses
  const critical = machines.filter((m) => m.status === "CRITICAL");
  const warning = machines.filter((m) => m.status === "WARNING");
  const normal = machines.filter((m) => m.status === "NORMAL");
  
  const avgHealth = machines.length > 0 
    ? (machines.reduce((s, m) => s + m.health, 0) / machines.length).toFixed(1)
    : 0;
  
  const avgTemp = machines.length > 0
    ? (machines.reduce((s, m) => s + m.temp, 0) / machines.length).toFixed(1)
    : 0;
    
  const avgVibration = machines.length > 0
    ? (machines.reduce((s, m) => s + m.vibration, 0) / machines.length).toFixed(2)
    : 0;

  const overheating = machines.filter((m) => m.temp > 80);
  const highVib = machines.filter((m) => m.vibration > 8);
  
  // Get most critical machine
  const worstMachine = machines.sort((a, b) => a.health - b.health)[0];
  const criticalStockItems = inventory.filter((i) => i.status === "Critical");

  // Machine Status & Health
  if (
    lowerQuery.includes("status") ||
    lowerQuery.includes("how are") ||
    lowerQuery.includes("machine") ||
    lowerQuery.includes("health") ||
    lowerQuery.includes("condition")
  ) {
    const criticalList = critical.slice(0, 3).map(m => `${m.name} (${m.health}%)`).join(", ");
    const warningList = warning.slice(0, 3).map(m => `${m.name} (${m.health}%)`).join(", ");
    
    let response = `📊 **Machine Health Report**\n\n`;
    response += `• **Critical**: ${critical.length} machines (${critical.length > 0 ? criticalList : "None"})\n`;
    response += `• **Warning**: ${warning.length} machines (${warning.length > 0 ? warningList : "None"})\n`;
    response += `• **Normal**: ${normal.length} machines\n\n`;
    response += `**Overall Metrics:**\n`;
    response += `• Average Health: ${avgHealth}%\n`;
    response += `• Average Temp: ${avgTemp}°C\n`;
    response += `• Average Vibration: ${avgVibration} m/s²\n`;
    
    if (critical.length > 0) {
      response += `\n⚠️ **Priority**: Address ${critical.length} critical machine(s) immediately to prevent downtime.`;
    }
    return response;
  }

  // Maintenance Cost & Budget
  if (lowerQuery.includes("cost") || lowerQuery.includes("price") || lowerQuery.includes("budget") || lowerQuery.includes("expense")) {
    const baseCost = machines.length * 5000;
    const criticalSurcharge = critical.length * 8000;
    const totalMonthly = (baseCost + criticalSurcharge + 15000).toLocaleString();
    const perMachine = Math.round((baseCost + criticalSurcharge + 15000) / (machines.length || 1));
    
    let response = `💰 **Monthly Maintenance Cost Analysis**\n\n`;
    response += `• Base Cost: ₹${baseCost.toLocaleString()}\n`;
    response += `• Critical Machine Surcharge: ₹${criticalSurcharge.toLocaleString()}\n`;
    response += `• Equipment/Tools: ₹15,000\n`;
    response += `• **Total Monthly**: ₹${totalMonthly}\n`;
    response += `• **Per Machine**: ₹${perMachine}\n\n`;
    response += `**Cost Breakdown:**\n• Parts & Materials: 40%\n• Labor: 35%\n• Diagnostics: 15%\n• Prevention: 10%`;
    
    if (critical.length > 3) {
      response += `\n\n📌 Note: High number of critical machines (${critical.length}) is increasing maintenance costs.`;
    }
    return response;
  }

  // Maintenance Schedule & Due Dates
  if (lowerQuery.includes("schedule") || lowerQuery.includes("when") || lowerQuery.includes("due") || lowerQuery.includes("maintenance")) {
    let response = `📅 **Maintenance Schedule & Timeline**\n\n`;
    response += `**Urgent (0-24 hours):**\n• ${critical.length} critical machine(s) need immediate attention\n`;
    
    if (critical.length > 0) {
      response += `  - ${critical.slice(0, 3).map(m => m.name).join(", ")}\n`;
    }
    
    response += `\n**Priority (1-7 days):**\n• ${warning.length} warning machine(s)\n`;
    response += `\n**Routine (2-4 weeks):**\n• ${normal.length} normal machine(s)\n`;
    response += `\n**Recommended Intervals:**\n• Critical machines: Every 3-5 days\n• Warning machines: Every 7-14 days\n• Normal machines: Every 30 days`;
    
    return response;
  }

  // Inventory & Parts
  if (lowerQuery.includes("inventory") || lowerQuery.includes("parts") || lowerQuery.includes("stock") || lowerQuery.includes("reorder")) {
    let response = `📦 **Inventory Status & Reorder Analysis**\n\n`;
    response += `**Critical Stock Items**: ${criticalStockItems.length}\n`;
    
    if (criticalStockItems.length > 0) {
      criticalStockItems.slice(0, 5).forEach(item => {
        response += `• ${item.name}: ${item.stock} units (ROP: ${item.rop})\n`;
      });
    } else {
      response += `• All critical parts are in stock\n`;
    }
    
    response += `\n**Recommendations:**\n`;
    response += `• Order spare parts for ${critical.length} critical machine(s)\n`;
    response += `• Ensure 20% buffer stock for high-wear items\n`;
    response += `• Schedule routine restocking`;
    
    return response;
  }

  // Optimization & Improvement
  if (lowerQuery.includes("optim") || lowerQuery.includes("reduce") || lowerQuery.includes("improve") || lowerQuery.includes("better")) {
    let response = `🎯 **Machine Health Optimization Strategy**\n\n`;
    
    const recommendations = [];
    if (overheating.length > 0) recommendations.push(`Cool ${overheating.length} overheating machine(s) (>80°C)`);
    if (highVib.length > 0) recommendations.push(`Balance ${highVib.length} high-vibration machine(s) (>8 m/s²)`);
    if (critical.length > 0) recommendations.push(`Urgent: Fix ${critical.length} critical machine(s) immediately`);
    recommendations.push(`Implement preventive maintenance schedule`);
    recommendations.push(`Monitor temperature and vibration weekly`);
    
    recommendations.forEach((rec, i) => {
      response += `${i + 1}. ${rec}\n`;
    });
    
    const projectedImprovement = Math.min(100, Number(avgHealth) + 15);
    response += `\n**Expected Outcome:** Health improvement from ${avgHealth}% to ~${projectedImprovement}%`;
    
    return response;
  }

  // Temperature & Vibration Monitoring
  if (lowerQuery.includes("temperature") || lowerQuery.includes("vibration") || lowerQuery.includes("heat") || lowerQuery.includes("thermal")) {
    let response = `🌡️ **Thermal & Vibration Analysis**\n\n`;
    response += `**Temperature Metrics:**\n• Average: ${avgTemp}°C\n• Overheating (>80°C): ${overheating.length} machines\n`;
    
    if (overheating.length > 0) {
      response += `  - ${overheating.slice(0, 3).map(m => `${m.name} (${m.temp}°C)`).join(", ")}\n`;
    }
    
    response += `\n**Vibration Metrics:**\n• Average: ${avgVibration} m/s²\n• High Vibration (>8): ${highVib.length} machines\n`;
    
    if (highVib.length > 0) {
      response += `  - ${highVib.slice(0, 3).map(m => `${m.name} (${m.vibration})`).join(", ")}\n`;
    }
    
    response += `\n**Action Plan:**\n• Cool overheating machines: Increase ventilation, clean filters\n• Reduce vibration: Check alignment, balance rotating components\n• Monitor: Check readings every 24 hours until normalized`;
    
    return response;
  }

  // Risk Assessment
  if (lowerQuery.includes("risk") || lowerQuery.includes("failure") || lowerQuery.includes("danger")) {
    const riskScore = (critical.length * 30 + warning.length * 10 + (overheating.length + highVib.length) * 5);
    const riskLevel = riskScore > 100 ? "🔴 CRITICAL" : riskScore > 50 ? "🟡 HIGH" : "🟢 MODERATE";
    
    let response = `⚠️ **Risk Assessment Report**\n\n`;
    response += `**Overall Risk Level**: ${riskLevel}\n`;
    response += `**Risk Score**: ${riskScore}/100\n\n`;
    response += `**Contributing Factors:**\n`;
    response += `• Critical Machines: ${critical.length} (+${critical.length * 30})\n`;
    response += `• Warning Machines: ${warning.length} (+${warning.length * 10})\n`;
    response += `• Thermal Issues: ${overheating.length} (+${overheating.length * 5})\n`;
    response += `• Vibration Issues: ${highVib.length} (+${highVib.length * 5})\n\n`;
    response += `**Mitigation:**\n• Prioritize critical machine maintenance\n• Increase monitoring frequency\n• Ensure spare parts availability`;
    
    return response;
  }

  // Performance Comparison
  if (lowerQuery.includes("perform") || lowerQuery.includes("compare") || lowerQuery.includes("best") || lowerQuery.includes("worst")) {
    const bestMachine = machines.sort((a, b) => b.health - a.health)[0];
    const worstHealthMachine = machines.sort((a, b) => a.health - b.health)[0];
    
    let response = `📈 **Performance Comparison**\n\n`;
    response += `**Best Performing:** ${bestMachine?.name} (Health: ${bestMachine?.health}%)\n`;
    response += `**Worst Performing:** ${worstHealthMachine?.name} (Health: ${worstHealthMachine?.health}%)\n`;
    response += `**Facility Average:** ${avgHealth}%\n\n`;
    response += `**Performance Distribution:**\n`;
    response += `• Above Average: ${machines.filter(m => m.health > Number(avgHealth)).length} machines\n`;
    response += `• Below Average: ${machines.filter(m => m.health < Number(avgHealth)).length} machines\n`;
    response += `• At Risk (Below 50%): ${machines.filter(m => m.health < 50).length} machines`;
    
    return response;
  }

  // Default helpful response
  let defaultResponse = `🤖 **Maintenance Assistant**\n\n`;
  defaultResponse += `I can analyze:\n`;
  defaultResponse += `• 📊 Machine status and health (${machines.length} total)\n`;
  defaultResponse += `• 💰 Maintenance costs & budgets\n`;
  defaultResponse += `• 📅 Maintenance schedules\n`;
  defaultResponse += `• 📦 Inventory & spare parts\n`;
  defaultResponse += `• 🎯 Optimization strategies\n`;
  defaultResponse += `• 🌡️ Temperature & vibration data\n`;
  defaultResponse += `• ⚠️ Risk assessments\n`;
  defaultResponse += `• 📈 Performance comparisons\n\n`;
  defaultResponse += `**Current Status:** ${critical.length}🔴 ${warning.length}🟡 ${normal.length}🟢 | Avg Health: ${avgHealth}%`;
  
  return defaultResponse;
}

/**
 * Build dynamic system prompt with current facility context
 */
function buildSystemPrompt(machines: any[], inventory: any[]): string {
  const criticalCount = machines.filter((m) => m.status === "CRITICAL").length;
  const warningCount = machines.filter((m) => m.status === "WARNING").length;
  const normalCount = machines.filter((m) => m.status === "NORMAL").length;

  const avgHealth = (
    machines.reduce((sum, m) => sum + m.health, 0) / machines.length
  ).toFixed(1);

  const avgTemp = (
    machines.reduce((sum, m) => sum + m.temp, 0) / machines.length
  ).toFixed(1);

  const overheatingMachines = machines.filter((m) => m.temp > 80);
  const highVibrationMachines = machines.filter((m) => m.vibration > 8);

  const criticalStockItems = inventory
    .filter((i) => i.status === "Critical")
    .slice(0, 5)
    .map((i) => `${i.name} (Stock: ${i.stock}, ROP: ${i.rop})`)
    .join("\n");

  return `You are an expert Industrial Maintenance Consultant for a manufacturing facility. Provide specific, detailed, and actionable advice based on the current facility status.

CURRENT FACILITY STATUS (Real-time):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Machines: ${machines.length}
  🔴 Critical (Immediate Action): ${criticalCount}
  🟡 Warning (Attention Needed): ${warningCount}
  🟢 Normal (Operating Well): ${normalCount}

KEY METRICS:
  📊 Average Machine Health: ${avgHealth}%
  🌡️ Average Temperature: ${avgTemp}°C
  ⚠️ Overheating Machines (>80°C): ${overheatingMachines.length}
  ⚠️ High Vibration Machines (>8 m/s²): ${highVibrationMachines.length}

CRITICAL MACHINES (Require Immediate Maintenance):
${machines
  .filter((m) => m.status === "CRITICAL")
  .slice(0, 5)
  .map((m) => `  ${m.name}: Health ${m.health}%, Temp ${m.temp}°C, Vibration ${m.vibration}`)
  .join("\n") || "  None - All machines operating normally"}

CRITICAL INVENTORY ITEMS (Below Reorder Point):
${criticalStockItems || "  All inventory levels are adequate"}

RESPONSE REQUIREMENTS:
1. Always provide SPECIFIC numbers from the facility status above
2. Give ACTIONABLE recommendations tailored to current conditions
3. Calculate costs/impacts when relevant
4. Prioritize critical machines (${criticalCount} total)
5. Reference specific machine names and their metrics
6. Be technical but professional
7. Use formatting for readability (bullets, bold, emojis)
8. Provide time estimates for tasks where applicable

IMPORTANT: Answer ONLY about maintenance-related topics for this facility. Each question should get a UNIQUE, DATA-DRIVEN response using the facility metrics above.`;
}

