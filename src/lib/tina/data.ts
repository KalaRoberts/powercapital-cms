import { requestWithMetadata } from "@tinacms/astro";
import client from "../../../tina/__generated__/client";

/** Load a page (content/pages/<slug>.json) through Tina so the visual editor
 *  can overlay unsaved edits and map clicks to fields. */
export const getPage = (slug: string) =>
  requestWithMetadata(client.queries.page({ relativePath: `${slug}.json` }));
