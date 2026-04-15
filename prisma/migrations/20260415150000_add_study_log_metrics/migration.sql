ALTER TABLE "StudyLog"
ADD COLUMN "studyMinutes" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "understandingNote" TEXT NOT NULL DEFAULT '';

UPDATE "StudyLog"
SET
  "understandingNote" = "content",
  "studyMinutes" = 1;

ALTER TABLE "StudyLog"
DROP COLUMN "content";
