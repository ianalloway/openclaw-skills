// Theme-only plugin: OpenClaw reads the themes declared in openclaw.plugin.json
// statically, so the runtime entry registers nothing.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "theme-neon",
  name: "Neon themes",
  description: "Neon cyberpunk appearance themes for the OpenClaw Control UI.",
  register() {},
});
