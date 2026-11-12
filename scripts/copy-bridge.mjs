// Dev helper: copy Tina's editor bridge into public/admin so /admin/bridge.js
// is served during `npm run dev` (the @tinacms/astro dev route isn't being hit
// on this setup). Production builds get it from the integration automatically.
import { copyFileSync, mkdirSync } from "node:fs";
mkdirSync("public/admin", { recursive: true });
copyFileSync("node_modules/@tinacms/bridge/dist/index.js", "public/admin/bridge.js");
console.log("[copy-bridge] public/admin/bridge.js ready");
