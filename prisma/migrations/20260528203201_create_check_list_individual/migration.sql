-- DropForeignKey
ALTER TABLE "Checklist" DROP CONSTRAINT "Checklist_sectorId_fkey";

-- AlterTable
ALTER TABLE "Checklist" ADD COLUMN     "assignedUserId" TEXT,
ALTER COLUMN "sectorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "Sector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist" ADD CONSTRAINT "Checklist_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
