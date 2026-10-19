import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// rpc-websockets' node export pulls Node-only internals; the browser build
// (WebSocket client) is what @solana/web3.js actually needs on the Worker.
// Aliased to the file directly because the package exports only the "." entry.
const rpcWebsocketsBrowser = fileURLToPath(
  new URL("./node_modules/rpc-websockets/dist/index.browser.mjs", import.meta.url),
);
export default defineConfig({
  vite: {
    resolve: {
      alias: [{ find: /^rpc-websockets$/, replacement: rpcWebsocketsBrowser }],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
