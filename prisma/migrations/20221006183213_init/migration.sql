-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Admin', 'Employee', 'Client');

-- CreateTable
CREATE TABLE "Auth" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "isGoogle" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "idAuth" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_idAuth_key" ON "User"("idAuth");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idAuth_fkey" FOREIGN KEY ("idAuth") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
