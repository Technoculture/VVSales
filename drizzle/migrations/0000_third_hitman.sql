CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`contactNumber` text,
	`city` text,
	`state` text,
	`targetCallCount` integer,
	`created_at` integer NOT NULL,
	`modified_at` integer
);
