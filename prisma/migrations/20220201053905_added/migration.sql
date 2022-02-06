/*
  Warnings:

  - Added the required column `authorId` to the `tweet_parent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tweet_comment` ADD COLUMN `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- AlterTable
ALTER TABLE `tweet_parent` ADD COLUMN `authorId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `username` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `user.email_unique`(`email`),
    UNIQUE INDEX `user.username_unique`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tweet_parent` ADD FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
