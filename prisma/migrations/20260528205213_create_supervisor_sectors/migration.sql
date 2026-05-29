-- CreateTable
CREATE TABLE "_SectorSupervisors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SectorSupervisors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SectorSupervisors_B_index" ON "_SectorSupervisors"("B");

-- AddForeignKey
ALTER TABLE "_SectorSupervisors" ADD CONSTRAINT "_SectorSupervisors_A_fkey" FOREIGN KEY ("A") REFERENCES "Sector"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectorSupervisors" ADD CONSTRAINT "_SectorSupervisors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
