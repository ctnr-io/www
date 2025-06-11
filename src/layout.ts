import { html } from "@tmpl/core";

export type LayoutProps = {
  path?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  children: string;
};

export default ({
  title = "Homepage | ctnr.io",
  description = "Cloud Platform Solution for Everyone. Powered by Open Source Software.",
  image = "https://www.ctnr.io/assets/logo/default.png",
  url = "https://www.ctnr.io",
  children,
}: LayoutProps) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="icon" href="/favicon.png" type="image/png">
      <link rel="stylesheet" href="/styles.css">
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      <!-- Open Graph -->
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${url}" />
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${image}" />
    </head>
    <body class="w-full h-screen flex flex-col items-center justify-center bg-white">
      ${children}
    </body>
  </html>
`;
