-- CreateTable
CREATE TABLE "Transaction" (
    "value" TEXT NOT NULL,
    "buyerAddress" TEXT NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("buyerAddress","tokenAddress")
);
