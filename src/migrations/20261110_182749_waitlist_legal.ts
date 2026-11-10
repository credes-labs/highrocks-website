import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`waitlist_signups\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text,
  	\`birth_year\` numeric,
  	\`status\` text DEFAULT 'waiting',
  	\`source\` text,
  	\`consent_at\` text,
  	\`notes\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`waitlist_signups_email_idx\` ON \`waitlist_signups\` (\`email\`);`)
  await db.run(sql`CREATE INDEX \`waitlist_signups_updated_at_idx\` ON \`waitlist_signups\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`waitlist_signups_created_at_idx\` ON \`waitlist_signups\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`body\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_order_idx\` ON \`legal_pages_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_sections_parent_id_idx\` ON \`legal_pages_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`legal_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`last_updated\` text NOT NULL,
  	\`summary\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`legal_pages_slug_idx\` ON \`legal_pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_updated_at_idx\` ON \`legal_pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`legal_pages_created_at_idx\` ON \`legal_pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`_legal_pages_v_version_sections\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`heading\` text NOT NULL,
  	\`body\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_legal_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_version_sections_order_idx\` ON \`_legal_pages_v_version_sections\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_version_sections_parent_id_idx\` ON \`_legal_pages_v_version_sections\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_legal_pages_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text NOT NULL,
  	\`version_slug\` text NOT NULL,
  	\`version_last_updated\` text NOT NULL,
  	\`version_summary\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_parent_idx\` ON \`_legal_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_version_version_slug_idx\` ON \`_legal_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_version_version_updated_at_idx\` ON \`_legal_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_version_version_created_at_idx\` ON \`_legal_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_created_at_idx\` ON \`_legal_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_legal_pages_v_updated_at_idx\` ON \`_legal_pages_v\` (\`updated_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`waitlist_signups_id\` integer REFERENCES waitlist_signups(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`legal_pages_id\` integer REFERENCES legal_pages(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_waitlist_signups_id_idx\` ON \`payload_locked_documents_rels\` (\`waitlist_signups_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_legal_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_pages_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`waitlist_signups\`;`)
  await db.run(sql`DROP TABLE \`legal_pages_sections\`;`)
  await db.run(sql`DROP TABLE \`legal_pages\`;`)
  await db.run(sql`DROP TABLE \`_legal_pages_v_version_sections\`;`)
  await db.run(sql`DROP TABLE \`_legal_pages_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "articles_id", "media_id", "faqs_id", "faq_categories_id", "users_id") SELECT "id", "order", "parent_id", "path", "articles_id", "media_id", "faqs_id", "faq_categories_id", "users_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_articles_id_idx\` ON \`payload_locked_documents_rels\` (\`articles_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faq_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`faq_categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
}
