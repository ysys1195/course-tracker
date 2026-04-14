-- CreateEnum
CREATE TYPE "LearningResourceStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'REVIEWING', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "LearningResourcePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "LearningResource"
ADD COLUMN "status" "LearningResourceStatus" NOT NULL DEFAULT 'NOT_STARTED',
ADD COLUMN "priority" "LearningResourcePriority" NOT NULL DEFAULT 'MEDIUM';
