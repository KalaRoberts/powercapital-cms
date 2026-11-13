import { defineConfig, wrapFieldsWithMeta } from "tinacms";
import React from "react";

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
    { type: "string", name: "theme", label: "Background", options: ["plain", "mint", "soft"] },
    { type: "string", name: "columns", label: "Columns", options: ["3", "2"] },
    { type: "boolean", name: "centered", label: "Center the heading" },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "lead", label: "Lead paragraph", ui: { component: "textarea" } },
    {
      type: "object", name: "cards", label: "Cards", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.title || "Card" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Body (use **bold** for emphasis)", ui: { component: "textarea" } },
      ],
    },
    { type: "string", name: "note", label: "Closing note (optional, green line under the cards)" },
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

// ---- Interior-page block templates (About, and reused by later pages) ----
// Text fields accept **bold** for emphasis.
const pageHeroTemplate = {
  name: "pageHero",
  label: "Page Title Banner",
  fields: [
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Intro text", ui: { component: "textarea" } },
  ],
};

const bioTemplate = {
  name: "bio",
  label: "Bio (photo + text)",
  fields: [
    { type: "image", name: "portrait", label: "Portrait image" },
    { type: "string", name: "portraitAlt", label: "Portrait alt text" },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "object", name: "paragraphs", label: "Paragraphs", list: true,
      ui: { itemProps: (i: any) => ({ label: (i?.text || "Paragraph").slice(0, 48) }) },
      fields: [{ type: "string", name: "text", label: "Text (use **bold** for emphasis)", ui: { component: "textarea" } }],
    },
    {
      type: "object", name: "checklist", label: "Checklist items", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.text || "Item" }) },
      fields: [{ type: "string", name: "text", label: "Text" }],
    },
    { type: "string", name: "ctaLabel", label: "Button label" },
    { type: "string", name: "ctaHref", label: "Button link" },
  ],
};

const timelineTemplate = {
  name: "timeline",
  label: "Career Timeline",
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "lead", label: "Lead text" },
    {
      type: "object", name: "items", label: "Roles (first = current, green dot)", list: true,
      ui: { itemProps: (i: any) => ({ label: [i?.date, i?.title].filter(Boolean).join(" · ") || "Role" }) },
      fields: [
        { type: "string", name: "date", label: "Dates" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Description (use **bold** for emphasis)", ui: { component: "textarea" } },
      ],
    },
  ],
};

const featureCardsTemplate = {
  name: "featureCards",
  label: "Feature Cards (icons)",
  fields: [
    { type: "string", name: "theme", label: "Background", options: ["soft", "mint", "plain"] },
    { type: "string", name: "columns", label: "Columns", options: ["3", "2"] },
    { type: "string", name: "cardStyle", label: "Card style", options: ["card", "industry"] },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "lead", label: "Lead text (optional)" },
    {
      type: "object", name: "cards", label: "Cards", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.title || "Card" }) },
      fields: [
        { type: "string", name: "icon", label: "Icon (Font Awesome class, e.g. fa-solid fa-server)" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "subtitle", label: "Subtitle (optional, grey line under title)" },
        { type: "string", name: "body", label: "Body (use **bold** for emphasis)", ui: { component: "textarea" } },
      ],
    },
  ],
};

const textSectionTemplate = {
  name: "textSection",
  label: "Text Section",
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "body", label: "Body (use **bold** for emphasis)", ui: { component: "textarea" } },
  ],
};

const recommendationsTemplate = {
  name: "recommendations",
  label: "Recommendations (quotes)",
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    { type: "string", name: "lead", label: "Lead text" },
    {
      type: "object", name: "quotes", label: "Quotes", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.name || "Quote" }) },
      fields: [
        { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
        { type: "string", name: "name", label: "Name" },
        { type: "string", name: "role", label: "Role / title" },
      ],
    },
  ],
};

const numberedListTemplate = {
  name: "numberedList",
  label: "Numbered List (pillars)",
  fields: [
    { type: "string", name: "theme", label: "Background", options: ["soft", "mint", "plain"] },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object", name: "items", label: "Items", list: true,
      ui: { itemProps: (i: any) => ({ label: [i?.number, i?.title].filter(Boolean).join(" · ") || "Item" }) },
      fields: [
        { type: "string", name: "number", label: "Number (e.g. 01)" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "body", label: "Text (use **bold** for emphasis)", ui: { component: "textarea" } },
      ],
    },
  ],
};

const plansTemplate = {
  name: "plans",
  label: "Plans / Engagement Options",
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    {
      type: "object", name: "plans", label: "Plans", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.name || "Plan" }) },
      fields: [
        { type: "boolean", name: "featured", label: "Highlight this plan (orange border + badge)" },
        { type: "string", name: "badge", label: "Badge text when highlighted (default: Most popular)" },
        { type: "string", name: "name", label: "Plan name" },
        { type: "string", name: "summary", label: "Short description" },
        {
          type: "object", name: "features", label: "Bullet points", list: true,
          ui: { itemProps: (i: any) => ({ label: i?.text || "Bullet" }) },
          fields: [{ type: "string", name: "text", label: "Text" }],
        },
        { type: "string", name: "fit", label: "Good fit (text after 'Good fit:')" },
      ],
    },
  ],
};

const contactSectionTemplate = {
  name: "contactSection",
  label: "Contact Form + Details",
  fields: [
    { type: "string", name: "formHeading", label: "Form heading" },
    { type: "string", name: "formIntro", label: "Form intro" },
    {
      type: "object", name: "serviceOptions", label: "Service dropdown options", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.text || "Option" }) },
      fields: [{ type: "string", name: "text", label: "Option text" }],
    },
    { type: "string", name: "messagePlaceholder", label: "Message box hint text (grey text before typing)", ui: { component: "textarea" } },
    { type: "string", name: "buttonLabel", label: "Send button label" },
    { type: "string", name: "successMessage", label: "Message shown after sending (after 'Message sent!')" },
    { type: "string", name: "detailsHeading", label: "Details heading" },
    { type: "string", name: "detailsIntro", label: "Details intro" },
    {
      type: "object", name: "rows", label: "Detail rows", list: true,
      ui: { itemProps: (i: any) => ({ label: i?.label || "Row" }) },
      fields: [
        { type: "string", name: "icon", label: "Icon (Font Awesome class)" },
        { type: "string", name: "label", label: "Label" },
        { type: "string", name: "value", label: "Text" },
      ],
    },
    { type: "string", name: "linkedinLabel", label: "LinkedIn button label" },
    { type: "string", name: "linkedinHref", label: "LinkedIn link" },
    { type: "image", name: "profileImage", label: "Profile photo" },
    { type: "string", name: "profileName", label: "Profile name" },
    { type: "string", name: "profileRole", label: "Profile role" },
  ],
};

// Menu Label input with a hint that names this page's own url.
// Tina field hints are normally the same on every page, so this small custom
// input works out which page is open from the form's file path.
const MENU_HINT_REST =
  " doesn't change. This change will not show in the Menu until you click Save and takes up to 5 minutes to process. If you want your SEO title and Social share title to match, update below.";
const MenuLabelInput = wrapFieldsWithMeta((props: any) => {
  const id = String(props?.tinaForm?.id ?? props?.form?.id ?? props?.tinaForm?.relativePath ?? "");
  const slug = id.split("/").pop()?.replace(/\.json$/, "") ?? "";
  const url = slug ? `/${slug}` : "e.g. /about";
  return React.createElement(
    "div",
    { style: { width: "100%", maxWidth: "100%", minWidth: 0, boxSizing: "border-box" } },
    React.createElement(
      "p",
      {
        style: {
          fontSize: "12px", color: "#6b7280", margin: "0 0 8px", lineHeight: 1.4,
          whiteSpace: "normal", overflowWrap: "anywhere", wordBreak: "break-word", maxWidth: "100%",
        },
      },
      `Menu name only - the url (${url})${MENU_HINT_REST}`,
    ),
    React.createElement("input", {
      ...props.input,
      value: props.input?.value ?? "",
      type: "text",
      style: {
        width: "100%", maxWidth: "100%", boxSizing: "border-box", padding: "8px 12px", fontSize: "16px", borderRadius: "6px",
        border: "1px solid #e1ddec", boxShadow: "0 1px 2px rgba(0,0,0,.05)", background: "#fff",
      },
    }),
  );
});

// Menu label limit (keep in sync with NAV_MAX in src/lib/nav.ts).
const navLabelLimit = (value?: string) =>
  value && value.trim().length > 14
    ? `Keep it to 14 characters or fewer (now ${value.trim().length}) so the menu doesn't wrap.`
    : undefined;

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
        // Site-wide settings shown on every page (footer, etc.). One document only.
        name: "settings",
        label: "Site Settings",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        fields: [
          { type: "string", name: "footerTagline", label: "Footer tagline", ui: { component: "textarea" } },
        ],
      },
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
          {
            type: "string",
            name: "menuLabel",
            label: "Menu Label",
            ui: { component: MenuLabelInput, validate: navLabelLimit },
          },
          { type: "string", name: "title", label: "SEO title", description: "Shown in the browser tab and Google results.", required: true },
          { type: "string", name: "description", label: "SEO description", ui: { component: "textarea" } },
          { type: "string", name: "ogTitle", label: "Social share title", description: "Shown when the page is shared on LinkedIn etc." },
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
              pageHeroTemplate,
              bioTemplate,
              timelineTemplate,
              featureCardsTemplate,
              textSectionTemplate,
              recommendationsTemplate,
              numberedListTemplate,
              plansTemplate,
              contactSectionTemplate,
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
