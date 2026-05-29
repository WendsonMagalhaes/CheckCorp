/*
  Warnings:

  - A unique constraint covering the columns `[checklistId,userId,cycleKey]` on the table `ChecklistExecution` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChecklistExecution_checklistId_userId_cycleKey_key" ON "ChecklistExecution"("checklistId", "userId", "cycleKey");
