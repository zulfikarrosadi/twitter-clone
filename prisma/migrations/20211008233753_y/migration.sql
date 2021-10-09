/*
  Warnings:

  - You are about to drop the column `id_parent` on the `tweet_child` table. All the data in the column will be lost.
  - Added the required column `id_tweet_parent` to the `tweet_child` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tweet_child` DROP FOREIGN KEY `tweet_child_ibfk_1`;

-- AlterTable
ALTER TABLE `tweet_child` DROP COLUMN `id_parent`,
    ADD COLUMN `id_tweet_parent` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tweet_parent` ADD COLUMN `updated_at` DATETIME(0) DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- CreateIndex
CREATE INDEX `fk_parent_child` ON `tweet_child`(`id_tweet_parent`);

-- AddForeignKey
ALTER TABLE `tweet_child` ADD FOREIGN KEY (`id_tweet_parent`) REFERENCES `tweet_parent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
