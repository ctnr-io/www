import { html } from "@tmpl/core";
import "./src/index.html.ts";

try {
  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      "jsr:@tmpl/gen",
      "docs",
      "src",
    ],
  });

  const { code, stdout, stderr } = await command.output();
  if (code === 0) {
    console.log("HTML generated successfully.");
    console.log(new TextDecoder().decode(stdout));
  }

  if (code !== 0) {
    console.error("Error generating HTML:");
    console.error(new TextDecoder().decode(stderr));
    Deno.exit(code);
  }
} catch (error) {
  console.error("An error occurred while generating HTML:");
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error:", error);
  }
  Deno.exit(1);
}

// Simple WebSocket server for live reload
Deno.serve({
  port: 8000,
  onListen: () => {
    console.log("Server is running on http://localhost:8000");
  },
}, async (req) => {
  const url = new URL(req.url);
  const path = decodeURIComponent(url.pathname);
  const filepath = path === "/" ? "/index.html" : path;
  
  // Handle WebSocket connections
  if (req.headers.get("upgrade") === "websocket") {
    const { response } = Deno.upgradeWebSocket(req);
    return response;
  }
  
  try {
    // For HTML files, inject a simple reload script
    if (filepath.endsWith(".html")) {
      const content = await Deno.readTextFile("docs" + filepath);
      const injectedContent = content.replace(
        "</body>",
        html`<script>
          // Connect to WebSocket and reload when connection closes
          const ws = new WebSocket("ws://localhost:8000");
          ws.onclose = () => {
            console.log("WebSocket connection closed, reloading page...");
            // Wait until the is accessible
            setInterval(async () => {
              try {
                await fetch(location.href);
                location.reload();
              } catch (e) {
                console.error("Failed to reload:", e);
              }
            }, 1000);
          };
        </script></body>`
      );
      return new Response(injectedContent, {
        headers: { "Content-Type": "text/html" },
      });
    }
    
    // Serve static files
    const file = await Deno.open("docs" + filepath, { read: true });
    return new Response(file.readable);
  } catch {
    return new Response("404 Not Found", { status: 404 });
  }
});

