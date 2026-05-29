/*
  Warnings:

  - Made the column `cycleKey` on table `ChecklistExecution` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChecklistExecution" ALTER COLUMN "cycleKey" SET NOT NULL;
