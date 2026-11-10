import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`articles_sections_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_sections_list_order_idx\` ON \`articles_sections_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_sections_list_parent_id_idx\` ON \`articles_sections_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`body\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_sections_order_idx\` ON \`articles_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_sections_parent_id_idx\` ON \`articles_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles_takeaways\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_takeaways_order_idx\` ON \`articles_takeaways\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`articles_takeaways_parent_id_idx\` ON \`articles_takeaways\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`articles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`category\` text DEFAULT 'Guides',
  	\`published_at\` text,
  	\`excerpt\` text,
  	\`image_id\` integer,
  	\`intro\` text,
  	\`quote\` text,
  	\`slug\` text,
  	\`short_title\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_image_idx\` ON \`articles\` (\`image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`articles_slug_idx\` ON \`articles\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`articles_updated_at_idx\` ON \`articles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`articles_created_at_idx\` ON \`articles\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`articles__status_idx\` ON \`articles\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`articles_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`articles_texts_order_parent\` ON \`articles_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_version_sections_list\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v_version_sections\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_version_sections_list_order_idx\` ON \`_articles_v_version_sections_list\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_sections_list_parent_id_idx\` ON \`_articles_v_version_sections_list\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_version_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_version_sections_order_idx\` ON \`_articles_v_version_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_sections_parent_id_idx\` ON \`_articles_v_version_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_version_takeaways\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_version_takeaways_order_idx\` ON \`_articles_v_version_takeaways\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_takeaways_parent_id_idx\` ON \`_articles_v_version_takeaways\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_category\` text DEFAULT 'Guides',
  	\`version_published_at\` text,
  	\`version_excerpt\` text,
  	\`version_image_id\` integer,
  	\`version_intro\` text,
  	\`version_quote\` text,
  	\`version_slug\` text,
  	\`version_short_title\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_parent_idx\` ON \`_articles_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_image_idx\` ON \`_articles_v\` (\`version_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_slug_idx\` ON \`_articles_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_updated_at_idx\` ON \`_articles_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version_created_at_idx\` ON \`_articles_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_version_version__status_idx\` ON \`_articles_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_created_at_idx\` ON \`_articles_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_updated_at_idx\` ON \`_articles_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_articles_v_latest_idx\` ON \`_articles_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_articles_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_articles_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_articles_v_texts_order_parent\` ON \`_articles_v_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`category_id\` integer NOT NULL,
  	\`order\` numeric DEFAULT 10,
  	\`featured_on_home\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`category_id\`) REFERENCES \`faq_categories\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_category_idx\` ON \`faqs\` (\`category_id\`);`)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faq_categories\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`blurb\` text,
  	\`order\` numeric DEFAULT 10,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`faq_categories_slug_idx\` ON \`faq_categories\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`faq_categories_updated_at_idx\` ON \`faq_categories\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faq_categories_created_at_idx\` ON \`faq_categories\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	\`media_id\` integer,
  	\`faqs_id\` integer,
  	\`faq_categories_id\` integer,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faq_categories_id\`) REFERENCES \`faq_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faq_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`faq_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`info_centre_tiles\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`article_id\` integer NOT NULL,
  	\`cta_label\` text NOT NULL,
  	\`cta_link\` text DEFAULT '/articles',
  	FOREIGN KEY (\`article_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`info_centre\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`info_centre_tiles_order_idx\` ON \`info_centre_tiles\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`info_centre_tiles_parent_id_idx\` ON \`info_centre_tiles\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`info_centre_tiles_article_idx\` ON \`info_centre_tiles\` (\`article_id\`);`)
  await db.run(sql`CREATE TABLE \`info_centre\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`CREATE TABLE \`info_centre_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`articles_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`info_centre\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`articles_id\`) REFERENCES \`articles\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`info_centre_rels_order_idx\` ON \`info_centre_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`info_centre_rels_parent_idx\` ON \`info_centre_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`info_centre_rels_path_idx\` ON \`info_centre_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`info_centre_rels_articles_id_idx\` ON \`info_centre_rels\` (\`articles_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`articles_sections_list\`;`)
  await db.run(sql`DROP TABLE \`articles_sections\`;`)
  await db.run(sql`DROP TABLE \`articles_takeaways\`;`)
  await db.run(sql`DROP TABLE \`articles\`;`)
  await db.run(sql`DROP TABLE \`articles_texts\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_version_sections_list\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_version_sections\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_version_takeaways\`;`)
  await db.run(sql`DROP TABLE \`_articles_v\`;`)
  await db.run(sql`DROP TABLE \`_articles_v_texts\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`faq_categories\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`info_centre_tiles\`;`)
  await db.run(sql`DROP TABLE \`info_centre\`;`)
  await db.run(sql`DROP TABLE \`info_centre_rels\`;`)
}
