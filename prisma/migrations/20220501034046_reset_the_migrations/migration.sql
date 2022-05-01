-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(70) NOT NULL,
    `bio` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `avatar` VARCHAR(255),
    `user_settings_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `genders_id` INTEGER NOT NULL DEFAULT 0,
    `date_birth` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `user_settings.username_unique`(`username`),
    UNIQUE INDEX `user_settings.email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_parent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140),
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(3),
    `authorId` INTEGER NOT NULL,

    INDEX `fk_tweet_parent_user`(`authorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_child` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140) NOT NULL,
    `id_tweet_parent` INTEGER NOT NULL,

    INDEX `fk_parent_child`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `images` VARCHAR(255),
    `description` VARCHAR(255),

    INDEX `fk_tweet_parent`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `content` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `authorId` INTEGER NOT NULL,

    INDEX `fk_user_comment`(`authorId`),
    INDEX `id_tweet_parent`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user` ADD FOREIGN KEY (`user_settings_id`) REFERENCES `user_settings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD FOREIGN KEY (`genders_id`) REFERENCES `genders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_parent` ADD FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_child` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comment` ADD FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comment` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
