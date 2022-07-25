-- CreateTable
CREATE TABLE `likes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tweet_parent_id` INTEGER NOT NULL,
    `tweet_child_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `retweets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tweetParentId` INTEGER NOT NULL,
    `tweetChildId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_tweet_parent_id_fkey` FOREIGN KEY (`tweet_parent_id`) REFERENCES `tweet_parents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_tweet_child_id_fkey` FOREIGN KEY (`tweet_child_id`) REFERENCES `tweet_childs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retweets` ADD CONSTRAINT `retweets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retweets` ADD CONSTRAINT `retweets_tweetParentId_fkey` FOREIGN KEY (`tweetParentId`) REFERENCES `tweet_parents`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `retweets` ADD CONSTRAINT `retweets_tweetChildId_fkey` FOREIGN KEY (`tweetChildId`) REFERENCES `tweet_childs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
