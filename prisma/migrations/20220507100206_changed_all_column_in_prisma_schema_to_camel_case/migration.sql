/*
  Warnings:

  - You are about to drop the column `genders_id` on the `user_settings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user_settings` DROP FOREIGN KEY `user_settings_ibfk_1`;

-- AlterTable
ALTER TABLE `user_settings` DROP COLUMN `genders_id`,
    ADD COLUMN `gender_id` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `user_settings` ADD FOREIGN KEY (`gender_id`) REFERENCES `genders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
