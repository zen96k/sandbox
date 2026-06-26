CREATE TABLE `article_summary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`article_id` integer NOT NULL,
	`content_hash` text,
	`summary` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`error` text,
	`summarized_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`article_id`) REFERENCES `article`(`id`) ON UPDATE cascade ON DELETE cascade,
	CONSTRAINT "article_summary_status_check" CHECK("article_summary"."status" in ('pending', 'processing', 'completed', 'failed'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `article_summary_article_id_unique` ON `article_summary` (`article_id`);