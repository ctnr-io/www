import { html } from "@tmpl/core";

async function generate() {
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
}

async function watchChanges() {
  const watcher = Deno.watchFs(["src"], {
    recursive: true,
  });

  for await (const event of watcher) {
    if (
      event.kind === "modify" || event.kind === "create" ||
      event.kind === "remove"
    ) {
      console.log("File change detected, regenerating HTML...");
      await generate();
      // for (const filePath of event.paths) {
      // console.log(`Changed file: ${filePath}`);
      // // await generate();
      // const command = new Deno.Command(Deno.execPath(), {
      //   args: [
      //     "run",
      //     "-A",
      //     "jsr:@tmpl/gen",
      //   ],
      //   stdin: "piped",
      //   stdout: "piped",
      //   stderr: "piped",
      // });
      // const childProcess = command.spawn();
      // const stdinWriter = childProcess.stdin.getWriter();
      // const fileContent = await Deno.readFile(filePath);
      // await stdinWriter.write(fileContent);
      // await stdinWriter.close();
      // const { code, stdout, stderr } = await childProcess.output();
      // if (code !== 0) {
      //   console.error("Error generating HTML:");
      //   console.error(new TextDecoder().decode(stderr));
      //   Deno.exit(code);
      // }
      // if (code !== 0) {
      //   console.log("HTML generated successfully.");
      //   const outputFilePath = filePath.endsWith(".ts") ? filePath.replace(/^src(.*).ts$/, "docs$1") : filePath.replace(/^src(.*)$/, "docs$1");
      //   Deno.writeFile(filePath.replace(/^src(.*).ts$/, ""), fileContent);
      // }
      // console.log("HTML regeneration complete.");
      // }
    }
  }
}

await generate();
watchChanges();

// Simple WebSocket server for live reload
Deno.serve({
  port: 8000,
  onListen: () => {
    console.log("Server is running on http://localhost:8000");
  },
}, async (req) => {
  const url = new URL(req.url);
  const path = decodeURIComponent(url.pathname);
  const filepath = path.endsWith("/") || !path.match(/\..+$/) ? path + "/index.html" : path;


  // Handle WebSocket connections
  if (req.headers.get("upgrade") === "websocket") {
    const { response, socket } = Deno.upgradeWebSocket(req);
    (async () => {
      const watcher = Deno.watchFs(["src"], {
        recursive: true,
      });
      for await (const event of watcher) {
        if (
          event.kind === "modify" || event.kind === "create" ||
          event.kind === "remove"
        ) {
          socket.close();
        }
      }
    })();
    return response;
  }

  try {
    // For HTML files, inject a simple reload script
    if (filepath.endsWith(".html")) {
      const content = await Deno.readTextFile("docs" + filepath);
      const injectedContent = content.replace(
        "</body>",
        html`
          <script>
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
          </script>
          </body>
        `,
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
