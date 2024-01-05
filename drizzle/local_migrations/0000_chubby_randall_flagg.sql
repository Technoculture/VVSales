CREATE TABLE `callLogs` (
	`id` integer PRIMARY KEY NOT NULL,
	`taskId` integer,
	`callTime` integer,
	`callStatus` text,
	`created_at` integer NOT NULL,
	`duration` integer
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`contactNumber` text,
	`city` text,
	`state` text,
	`targetCallCount` integer,
	`created_at` integer NOT NULL,
	`modified_at` integer NOT NULL
);
