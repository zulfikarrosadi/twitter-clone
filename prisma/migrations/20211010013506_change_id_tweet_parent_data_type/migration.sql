/*
  Warnings:

  - The primary key for the `tweet_parent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `tweet_child` DROP FOREIGN KEY `tweet_child_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_photos` DROP FOREIGN KEY `tweet_photos_ibfk_1`;

-- AlterTable
ALTER TABLE `tweet_child` MODIFY `id_tweet_parent` VARCHAR(40) NOT NULL;

-- AlterTable
ALTER TABLE `tweet_parent` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(40) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tweet_photos` MODIFY `id_tweet_parent` VARCHAR(40) NOT NULL;

-- AddForeignKey
ALTER TABLE `tweet_child` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
