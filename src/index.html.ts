import { html } from "@tmpl/core";
import layout from "src/layout.ts";

export type HomePage = {
  children?: string;
};

export default layout({
  children: html`
    <header class="fixed top-0 left-0 w-full flex items-center justify-center p-4">
      <img
        src="/assets/logo/default.png"
        alt="ctnr.io Logo"
        class="logo"
        style="width: 200px; height: auto;"
      >
    </header>
    <main class="w-full h-screen flex flex-col items-center justify-center bg-white">
      <h1 class="text-4xl font-bold text-gray-800">
        Welcome to ctnr.io
      </h1>
      <p class="mt-4 text-lg text-gray-600">
        Cloud Platform Solution for Everyone. Powered by Open Source Software.
      </p>
      <!-- <div class="mt-8 flex space-x-4">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Get Started
        </button>
        <button class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">
          Learn More
        </button>
      </div> -->
    </main>
  `,
});
