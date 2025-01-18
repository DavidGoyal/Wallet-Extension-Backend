-- CreateTable
CREATE TABLE "Token" (
    "address" TEXT NOT NULL,
    "transaction" TEXT NOT NULL,
    "creator" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("address")
);

-- CreateIndex
CREATE INDEX "Token_address_idx" ON "Token"("address");
