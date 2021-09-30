-- CreateTable
CREATE TABLE `tweet_child` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_parent` INTEGER NOT NULL,
    `tweet` VARCHAR(140) NOT NULL,

    INDEX `fk_parent_child`(`id_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_parent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet` VARCHAR(140) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tweet_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `images` VARCHAR(255),

    INDEX `fk_tweet_parent`(`id_tweet_parent`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tweet_child` ADD FOREIGN KEY (`id_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
