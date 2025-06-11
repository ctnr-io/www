import { html } from "@tmpl/core";

export default html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ctnr.io | Homepage</title>
      <link rel="icon" href="/favicon.png" type="image/png">
      <link rel="stylesheet" href="/styles.css">
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      <script type="module" src="/src/main.ts"></script>
    </head>
    <body class="w-full h-screen flex items-center justify-center bg-white">
      <header>
        <img
          src="/assets/logo/default.png"
          alt="ctnr.io Logo"
          class="logo"
          style="width: 200px; height: auto;"
        >
      </header>
    </body>
  </html>
`;
