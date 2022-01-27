-- CreateTable
CREATE TABLE `tweet_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tweet_parent` INTEGER NOT NULL,
    `content` VARCHAR(500) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tweet_comment` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
