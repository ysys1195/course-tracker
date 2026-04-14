-- AlterTable
ALTER TABLE "LearningResource"
ADD COLUMN "provider" TEXT,
ADD COLUMN "description" TEXT;

UPDATE "LearningResource"
SET "provider" = '未設定'
WHERE "provider" IS NULL;

ALTER TABLE "LearningResource"
ALTER COLUMN "provider" SET NOT NULL;
