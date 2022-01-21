-- AlterTable
ALTER TABLE `tweet_parent` MODIFY `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `updated_at` DATETIME(3);
