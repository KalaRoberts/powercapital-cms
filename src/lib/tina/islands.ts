import type { IslandRegistry } from "@tinacms/astro/experimental";
import PageBlocks from "../../components/PageBlocks.astro";
import { getPage } from "./data";

export const PAGE_WRAPPER = { tag: "div", className: "page-blocks" };

/** One editable region per page: all of its sections. */
export const islands: IslandRegistry = {
  page: {
    fetch: (_request, params) => getPage(params.get("slug") ?? "home"),
    component: PageBlocks,
    wrapper: PAGE_WRAPPER,
    propsFromData: (data) => ({
      page: (data as { data?: { page?: unknown } }).data?.page,
    }),
  },
};
