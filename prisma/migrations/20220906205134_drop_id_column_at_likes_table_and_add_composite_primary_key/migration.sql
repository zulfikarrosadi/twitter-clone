/*
  Warnings:

  - The primary key for the `likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `likes` table. All the data in the column will be lost.
  - Made the column `tweet_child_id` on table `likes` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `likes` DROP FOREIGN KEY `likes_tweet_child_id_fkey`;

-- AlterTable
ALTER TABLE `likes` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    MODIFY `tweet_child_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`user_id`, `tweet_parent_id`, `tweet_child_id`);

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_tweet_child_id_fkey` FOREIGN KEY (`tweet_child_id`) REFERENCES `tweet_childs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
