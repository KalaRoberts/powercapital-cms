import type { IslandRegistry } from "@tinacms/astro/experimental";
import PageBlocks from "../../components/PageBlocks.astro";
import FooterContent from "../../components/FooterContent.astro";
import { getPage, getSettings, getMenuLabels } from "./data";

export const PAGE_WRAPPER = { tag: "div", className: "page-blocks" };
export const FOOTER_WRAPPER = { tag: "footer", className: "site-footer" };

/** Editable regions: each page's sections, plus the site-wide footer. */
export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => getPage(params.get("slug") ?? "home"),
    component: PageBlocks,
    wrapper: PAGE_WRAPPER,
    propsFromData: (data) => ({
      page: (data as { data?: { page?: unknown } }).data?.page,
    }),
  },
  footer: {
    fetch: async () => Object.assign(await getSettings(), { menuLabels: await getMenuLabels() }),
    component: FooterContent,
    wrapper: FOOTER_WRAPPER,
    propsFromData: (data) => ({
      settings: (data as { data?: { settings?: unknown } }).data?.settings,
      labels: (data as { menuLabels?: unknown }).menuLabels,
    }),
  },
};
