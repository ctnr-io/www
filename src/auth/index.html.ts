import { html } from "@tmpl/core";
import layout from "src/layout.ts";

export type HomePage = {
  children?: string;
};

export default layout({
  children: html`
    <header>
      <img
        src="/assets/logo/default.png"
        alt="ctnr.io Logo"
        class="logo"
        style="width: 200px; height: auto;"
      >
    </header>
    <main class="w-full h-screen flex items-center justify-center bg-white">
      <h1 class="text-4xl font-bold text-gray-800">
        Sign in to ctnr.io 
      </h1>
      <p class="mt-4 text-lg text-gray-600">
      </p>
    </main>
  `,
});
