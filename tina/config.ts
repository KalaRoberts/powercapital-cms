import { defineConfig } from "tinacms";

/**
 * TinaCMS configuration for Power Capital.
 *
 * Content model: each page is a document in the "page" collection, stored as
 * JSON in content/pages/. A page has SEO fields + a `blocks` list. `blocks` is
 * a Tina "object" field with `list: true` and multiple templates — this is what
 * gives the non-tech editor the ability to REORDER, SHOW/HIDE (add/remove), and
 * EDIT sections, plus add/remove items in repeatable lists inside each block.
 *
 * NOTE: Client ID and token come from env vars, set in Cloudflare Pages:
 *   NEXT_PUBLIC_TINA_CLIENT_ID  and  TINA_TOKEN
 */

// ---- Reusable field groups ----
const ctaFields = [
  { type: "string", name: "ctaPrimaryLabel", label: "Primary button label" },
  { type: "string", name: "ctaPrimaryHref", label: "Primary button link" },
  { type: "string", name: "ctaSecondaryLabel", label: "Secondary button label" },
  { type: "string", name: "ctaSecondaryHref", label: "Secondary button link" },
] as const;

// ---- Block templates (the section types the Home page can use) ----
const heroTemplate = {
  name: "hero",
  label: "Hero",
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading", ui: { component: "textarea" } },
    { type: "string", name: "ctaPrimaryLabel", label: "Primary button label" },
    { type: "string", name: "ctaPrimaryHref", label: "Primary button link" },
    { type: "string", name: "ctaSecondaryLabel", label: "Secondary button label" },
    { type: "string", name: "ctaSecondaryHref", label: "Secondary button link" },
    { type: "image", name: "portrait", label: "Portrait image" },
    { type: "string", name: "portraitAlt", label: "Portrait alt text" },
    { type: "string", name: "badgeTop", label: "Badge — top line" },
    { type: "string", name: "badgeBottom", label: "Badge — bottom line" },
    {
      type: "object", name: "stats", label: "Stats", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.value || "Stat" }) },
      fields: [
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" },
      ],
    },
  ],
};

const painPointsTemplate = {
  name: "painPoints",
  label: "Pain Points",
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "lead", label: "Lead paragraph", ui: { component: "textarea" } },
    {
      type: "object", name: "cards", label: "Cards", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.title || "Card" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
      ],
    },
  ],
};

const positioningBannerTemplate = {
  name: "positioningBanner",
  label: "Positioning Banner",
  fields: [
    { type: "string", name: "theme", label: "Theme", options: ["navy", "mint"] },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
  ],
};

const processTemplate = {
  name: "process",
  label: "Process / Steps",
  fields: [
    { type: "string", name: "theme", label: "Theme", options: ["mint", "navy", "plain"] },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object", name: "steps", label: "Steps", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.title || "Step" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
      ],
    },
    { type: "string", name: "ctaLabel", label: "Button label" },
    { type: "string", name: "ctaHref", label: "Button link" },
  ],
};

const ctaBandTemplate = {
  name: "ctaBand",
  label: "CTA Band",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Body", ui: { component: "textarea" } },
    { type: "string", name: "ctaLabel", label: "Button label" },
    { type: "string", name: "ctaHref", label: "Button link" },
  ],
};

export default defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  branch:
    process.env.GITHUB_BRANCH ||
    process.env.WORKERS_CI_BRANCH ||   // Cloudflare Workers Builds
    process.env.CF_PAGES_BRANCH ||     // Cloudflare Pages (legacy)
    "main",
  build: { outputFolder: "admin", publicFolder: "public" },
  media: { tina: { mediaRoot: "assets/img", publicFolder: "public" } },
  schema: {
    collections: [
      {
        name: "page",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          // route each page doc to its live URL for Tina's "edit this page" link
          router: ({ document }) => {
            const slug = document._sys.filename;
            return slug === "home" ? "/" : `/${slug}`;
          },
        },
        fields: [
          { type: "string", name: "title", label: "SEO title", required: true },
          { type: "string", name: "description", label: "SEO description", ui: { component: "textarea" } },
          { type: "string", name: "ogTitle", label: "Social share title" },
          { type: "string", name: "ogDescription", label: "Social share description", ui: { component: "textarea" } },
          {
            type: "object",
            name: "blocks",
            label: "Page sections",
            list: true,
            templates: [
              heroTemplate,
              painPointsTemplate,
              positioningBannerTemplate,
              processTemplate,
              ctaBandTemplate,
            ],
            ui: {
              visualSelector: true,
              itemProps: (item: any) => ({ label: item?._template || "Section" }),
            },
          },
        ],
      },
    ],
  },
});
