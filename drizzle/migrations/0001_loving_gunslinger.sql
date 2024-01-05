CREATE TABLE `callLogs` (
	`id` integer PRIMARY KEY NOT NULL,
	`taskId` integer,
	`callTime` integer,
	`callStatus` text,
	`created_at` integer NOT NULL,
	`duration` integer
);
