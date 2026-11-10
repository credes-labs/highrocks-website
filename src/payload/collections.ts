import type { CollectionConfig, FieldHook, GlobalConfig } from "payload";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TAGS, revalidateGlobal, revalidateOnChange, revalidateOnDelete } from "./revalidate";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const isEditor = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

/** Lowercase, hyphenated URL slug. */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Fill the slug from another field when the editor leaves it blank. */
const slugFrom =
  (field: string): FieldHook =>
  ({ value, data }) =>
    typeof value === "string" && value.trim() ? slugify(value) : slugify(String(data?.[field] ?? ""));

export const Users: CollectionConfig = {
  slug: "users",
  admin: { useAsTitle: "email", group: "Admin" },
  auth: true,
  fields: [{ name: "name", type: "text" }],
};

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Info Centre", description: "Photos used by articles." },
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
    focalPoint: true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Describe the photo for screen readers and search engines, e.g. “Athlete pulling a SkiErg”." },
    },
  ],
  hooks: {
    afterChange: [revalidateOnChange(TAGS.articles, TAGS.infoCentre)],
    afterDelete: [revalidateOnDelete(TAGS.articles, TAGS.infoCentre)],
  },
};

export const FaqCategories: CollectionConfig = {
  slug: "faq-categories",
  labels: { singular: "FAQ category", plural: "FAQ categories" },
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "order"],
    group: "FAQs",
    description: "The groups on the FAQ page (Hyrox basics, Training & pacing…). Lower order shows first.",
  },
  defaultSort: "order",
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: "label", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Used for links like /faqs#hyrox. Filled from the label if left blank." },
      hooks: { beforeValidate: [slugFrom("label")] },
    },
    { name: "blurb", type: "text", admin: { description: "One line shown next to the group heading." } },
    { name: "order", type: "number", defaultValue: 10, admin: { position: "sidebar" } },
  ],
  hooks: {
    afterChange: [revalidateOnChange(TAGS.faqs)],
    afterDelete: [revalidateOnDelete(TAGS.faqs)],
  },
};

export const Faqs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "FAQ", plural: "FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order", "featuredOnHome"],
    group: "FAQs",
    description: "Every question on /faqs. Tick “Show on home page” for the three cards on the landing page.",
  },
  defaultSort: "order",
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  fields: [
    { name: "question", type: "text", required: true },
    {
      name: "answer",
      type: "textarea",
      required: true,
      admin: { description: "Answer in the first sentence; AI search engines often quote it as is." },
    },
    { name: "category", type: "relationship", relationTo: "faq-categories", required: true },
    { name: "order", type: "number", defaultValue: 10, admin: { position: "sidebar" } },
    { name: "featuredOnHome", label: "Show on home page", type: "checkbox", admin: { position: "sidebar" } },
  ],
  hooks: {
    afterChange: [revalidateOnChange(TAGS.faqs)],
    afterDelete: [revalidateOnDelete(TAGS.faqs)],
  },
};

const PARAGRAPHS_HINT = "Separate paragraphs with an empty line.";

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "Info Centre",
    description: "Guides, articles and blogs shown in the Info Centre and on /articles.",
    preview: (doc) => (doc?.slug ? `/articles/${doc.slug}` : null),
  },
  defaultSort: "-publishedAt",
  versions: { drafts: true, maxPerDoc: 20 },
  access: {
    // Visitors only ever see published articles; signed-in editors also see drafts.
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "select",
          required: true,
          defaultValue: "Guides",
          options: ["Guides", "Articles", "Blogs"],
        },
        {
          name: "publishedAt",
          label: "Published",
          type: "date",
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: "dayOnly", displayFormat: "d MMM yyyy" } },
        },
      ],
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      maxLength: 300,
      admin: { description: "One or two sentences that answer the title. Used on cards, in search results and by AI engines." },
    },
    { name: "image", type: "upload", relationTo: "media", required: true },
    {
      name: "intro",
      type: "textarea",
      required: true,
      admin: { description: `Opening paragraphs beside the title. Keep to two short paragraphs. ${PARAGRAPHS_HINT}` },
    },
    {
      name: "sections",
      type: "array",
      minRows: 1,
      admin: { description: "The body. The first two sections sit above the photo pair, the rest beside the key takeaways." },
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "body", type: "textarea", required: true, admin: { description: PARAGRAPHS_HINT } },
        { name: "list", type: "array", labels: { singular: "Bullet", plural: "Bullets" }, fields: [{ name: "text", type: "text", required: true }] },
      ],
    },
    { name: "quote", type: "text", admin: { description: "Pull quote shown in large type." } },
    {
      name: "takeaways",
      type: "array",
      labels: { singular: "Takeaway", plural: "Key takeaways" },
      fields: [{ name: "text", type: "text", required: true }],
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "The URL: /articles/<slug>. Filled from the title if left blank." },
      hooks: { beforeValidate: [slugFrom("title")] },
    },
    {
      name: "shortTitle",
      type: "text",
      admin: { position: "sidebar", description: "Optional shorter title for the Info Centre tiles." },
    },
    {
      name: "keywords",
      type: "text",
      hasMany: true,
      admin: { position: "sidebar", description: "Search phrases this article answers, e.g. “Hyrox sled push”." },
    },
  ],
  hooks: {
    afterChange: [revalidateOnChange(TAGS.articles, TAGS.infoCentre)],
    afterDelete: [revalidateOnDelete(TAGS.articles, TAGS.infoCentre)],
  },
};

export const InfoCentre: GlobalConfig = {
  slug: "info-centre",
  label: "Info Centre page",
  admin: { group: "Info Centre", description: "Which articles the Info Centre highlights." },
  access: { read: () => true, update: isEditor },
  fields: [
    {
      name: "tiles",
      label: "Category tiles",
      type: "array",
      minRows: 3,
      maxRows: 3,
      admin: { description: "The three tiles under the hero, left to right." },
      fields: [
        { name: "heading", type: "text", required: true, admin: { description: "e.g. Articles, Blogs, Guides" } },
        { name: "article", type: "relationship", relationTo: "articles", required: true },
        { name: "ctaLabel", label: "Button label", type: "text", required: true },
        { name: "ctaLink", label: "Button link", type: "text", defaultValue: "/articles" },
      ],
    },
    {
      name: "latest",
      label: "Latest rows",
      type: "relationship",
      relationTo: "articles",
      hasMany: true,
      maxRows: 3,
      admin: { description: "Up to three articles for the full-width “Latest” rows. Leave empty to use the newest." },
    },
  ],
  hooks: { afterChange: [revalidateGlobal(TAGS.infoCentre)] },
};
