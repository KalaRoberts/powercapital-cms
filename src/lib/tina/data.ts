import { requestWithMetadata } from "@tinacms/astro";
import client from "../../../tina/__generated__/client";

/** Load a page (content/pages/<slug>.json) through Tina so the visual editor
 *  can overlay unsaved edits and map clicks to fields. */
export const getPage = (slug: string) =>
  requestWithMetadata(client.queries.page({ relativePath: `${slug}.json` }));

/** Load site-wide settings (content/settings/site.json): footer tagline, etc. */
export const getSettings = () =>
  requestWithMetadata(client.queries.settings({ relativePath: "site.json" }));

/** Every page's Menu Label, keyed by slug (home, about, ...). Used by the
 *  header, footer and breadcrumbs. */
export async function getMenuLabels(): Promise<Record<string, string | null | undefined>> {
  const { NAV } = await import("../nav");
  const entries = await Promise.all(
    NAV.map(async (n) => {
      try {
        const r: any = await client.queries.page({ relativePath: `${n.key}.json` });
        return [n.key, r?.data?.page?.menuLabel] as const;
      } catch {
        return [n.key, undefined] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}
