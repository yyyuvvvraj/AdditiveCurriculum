-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "partId" TEXT NOT NULL,
    "partName" TEXT,
    "category" TEXT,
    "currentStock" INTEGER NOT NULL,
    "rop" INTEGER,
    "warningLevel" INTEGER,
    "vendor" TEXT,
    "leadTimeDay" INTEGER,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartHistory" (
    "id" SERIAL NOT NULL,
    "partRef" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "changeAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "PartHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Part_partId_key" ON "Part"("partId");

-- CreateIndex
CREATE INDEX "PartHistory_partRef_changeAt_idx" ON "PartHistory"("partRef", "changeAt");

-- AddForeignKey
ALTER TABLE "PartHistory" ADD CONSTRAINT "PartHistory_partRef_fkey" FOREIGN KEY ("partRef") REFERENCES "Part"("id") ON DELETE CASCADE ON UPDATE CASCADE;
