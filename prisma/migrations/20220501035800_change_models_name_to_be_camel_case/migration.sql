/*
  Warnings:

  - You are about to drop the `tweet_child` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tweet_comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tweet_parent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tweet_child` DROP FOREIGN KEY `tweet_child_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_comment` DROP FOREIGN KEY `tweet_comment_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_comment` DROP FOREIGN KEY `tweet_comment_ibfk_2`;

-- DropForeignKey
ALTER TABLE `tweet_parent` DROP FOREIGN KEY `tweet_parent_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_photos` DROP FOREIGN KEY `tweet_photos_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_ibfk_1`;

-- DropTable
DROP TABLE `tweet_child`;

-- DropTable
DROP TABLE `tweet_comment`;

-- DropTable
DROP TABLE `tweet_parent`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `tweet_parents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140),
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(3),
    `authorId` INTEGER NOT NULL,

    INDEX `fk_tweet_parent_user`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_childs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140) NOT NULL,
    `id_tweet_parent` INTEGER NOT NULL,

    INDEX `fk_parent_child`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `authorId` INTEGER NOT NULL,

    INDEX `fk_user_comment`(`authorId`),
    INDEX `id_tweet_parent`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `bio` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `avatar` VARCHAR(255),
    `user_settings_id` INTEGER NOT NULL,

    INDEX `user_settings_id`(`user_settings_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tweet_parents` ADD FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_childs` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comments` ADD FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comments` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD FOREIGN KEY (`user_settings_id`) REFERENCES `user_settings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
