-- CreateTable
CREATE TABLE `tweet_parents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(3) NULL,
    `authorId` INTEGER NOT NULL,

    INDEX `tweet_parents_authorId_fkey`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_childs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140) NOT NULL,
    `id_tweet_parent` INTEGER NOT NULL,

    INDEX `tweet_childs_id_tweet_parent_fkey`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `images` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,

    INDEX `tweet_photos_id_tweet_parent_fkey`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `authorId` INTEGER NOT NULL,

    INDEX `tweet_comments_authorId_fkey`(`authorId`),
    INDEX `tweet_comments_id_tweet_parent_fkey`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `bio` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `avatar` VARCHAR(255) NULL,
    `banner` VARCHAR(255) NULL,
    `user_setting_id` INTEGER NOT NULL,

    INDEX `users_user_setting_id_fkey`(`user_setting_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `gender_id` INTEGER NULL,
    `date_birth` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `user_settings_username_key`(`username`),
    UNIQUE INDEX `user_settings_email_key`(`email`),
    INDEX `user_settings_gender_id_fkey`(`gender_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tweet_parents` ADD CONSTRAINT `tweet_parents_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_childs` ADD CONSTRAINT `tweet_childs_id_tweet_parent_fkey` FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD CONSTRAINT `tweet_photos_id_tweet_parent_fkey` FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comments` ADD CONSTRAINT `tweet_comments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comments` ADD CONSTRAINT `tweet_comments_id_tweet_parent_fkey` FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_setting_id_fkey` FOREIGN KEY (`user_setting_id`) REFERENCES `user_settings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_gender_id_fkey` FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
