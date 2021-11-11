/*
  Warnings:

  - You are about to alter the column `id_tweet_parent` on the `tweet_child` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Int`.
  - The primary key for the `tweet_parent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `tweet_parent` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Int`.
  - You are about to alter the column `id_tweet_parent` on the `tweet_photos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(40)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `tweet_child` DROP FOREIGN KEY `tweet_child_ibfk_1`;

-- DropForeignKey
ALTER TABLE `tweet_photos` DROP FOREIGN KEY `tweet_photos_ibfk_1`;

-- AlterTable
ALTER TABLE `tweet_child` MODIFY `id_tweet_parent` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tweet_parent` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `updated_at` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0),
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `tweet_photos` MODIFY `id_tweet_parent` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tweet_child` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tweet_photos` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
