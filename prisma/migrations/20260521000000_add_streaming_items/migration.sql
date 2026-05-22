-- CreateTable
CREATE TABLE "streaming_items" (
    "id" TEXT NOT NULL,
    "sectionType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.8,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streaming_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "streaming_items_sectionType_sortOrder_idx" ON "streaming_items"("sectionType", "sortOrder");
