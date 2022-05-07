/*
  Warnings:

  - You are about to drop the column `user_settings_id` on the `users` table. All the data in the column will be lost.
  - Added the required column `user_setting_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `user_settings_id`,
    ADD COLUMN `user_setting_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `users` ADD FOREIGN KEY (`user_setting_id`) REFERENCES `user_settings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
