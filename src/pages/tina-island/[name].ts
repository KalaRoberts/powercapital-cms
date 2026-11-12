import type { APIRoute } from "astro";
import { experimental_createIslandRoute } from "@tinacms/astro/experimental";
import { islands } from "../../lib/tina/islands";

// Editor-only endpoint: rendered on demand, never prerendered.
export const prerender = false;
export const ALL: APIRoute = experimental_createIslandRoute(islands);
