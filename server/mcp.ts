import { McpServer } from "@modelcontextprotocol/sdk/server"; // Standard MCP SDK

const server = new McpServer({
  name: "Sovereign-Business-Magician",
  version: "1.0.0"
});

// Add a 'Tool' so the AI can check my local database
server.tool("get-blueprint-status", { userId: "number" }, async ({ userId }) => {
  // Directly query schema
  const data = await db.select().from(businessBlueprints).where(eq(businessBlueprints.userId, userId));
  return { content: [{ type: "text", text: JSON.stringify(data) }] };
});

// Start the server
server.connect();
