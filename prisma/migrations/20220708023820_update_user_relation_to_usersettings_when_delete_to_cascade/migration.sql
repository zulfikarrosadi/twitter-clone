-- DropForeignKey
ALTER TABLE `tweet_childs` DROP FOREIGN KEY `tweet_childs_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_comments` DROP FOREIGN KEY `tweet_comments_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_comments` DROP FOREIGN KEY `tweet_comments_ibfk_2`;

-- DropForeignKey
ALTER TABLE `tweet_parents` DROP FOREIGN KEY `tweet_parents_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_photos` DROP FOREIGN KEY `tweet_photos_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user_settings` DROP FOREIGN KEY `user_settings_ibfk_1`;

-- AddForeignKey
ALTER TABLE `tweet_parents` ADD FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_childs` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comments` ADD FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_comments` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_settings` ADD FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
