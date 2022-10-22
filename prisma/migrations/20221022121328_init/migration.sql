-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'employee', 'client');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('coffee', 'tea', 'sweetBakery', 'saltyBakery', 'other');

-- CreateEnum
CREATE TYPE "Texture" AS ENUM ('desertDunes', 'coarse', 'medium', 'fine', 'veryFine');

-- CreateEnum
CREATE TYPE "Body" AS ENUM ('light', 'perceivable', 'medium', 'thick', 'sirupy');

-- CreateEnum
CREATE TYPE "Acidity" AS ENUM ('notFound', 'light', 'perceivable', 'fresh', 'high');

-- CreateEnum
CREATE TYPE "Bitterness" AS ENUM ('light', 'perceivable', 'medium', 'high', 'veryHigh');

-- CreateEnum
CREATE TYPE "Roast" AS ENUM ('cinnamon', 'light', 'city', 'fullCity', 'dark', 'french', 'italian');

-- CreateEnum
CREATE TYPE "Color" AS ENUM ('yellow', 'amber', 'lightBrown', 'hazelnut', 'darkBrown', 'dark');

-- CreateEnum
CREATE TYPE "Percentage" AS ENUM ('five', 'ten', 'fifteen');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'complete');

-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('one', 'two', 'three', 'four', 'five');

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
    "name" VARCHAR(50) NOT NULL,
    "surname" VARCHAR(50),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'client',
    "idAuth" TEXT NOT NULL,
    "state" "State" NOT NULL DEFAULT 'active',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "price" REAL NOT NULL,
    "category" "Category" NOT NULL,
    "lactose" BOOLEAN NOT NULL,
    "gluten" BOOLEAN NOT NULL,
    "alcohol" BOOLEAN NOT NULL,
    "stock" BOOLEAN NOT NULL DEFAULT true,
    "ingredients" JSONB NOT NULL,
    "originCountry" VARCHAR(50),
    "isPrepared" BOOLEAN NOT NULL DEFAULT true,
    "discount" INTEGER,
    "idAttribute" TEXT,
    "state" "State" NOT NULL DEFAULT 'active',

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" TEXT NOT NULL,
    "cream" BOOLEAN NOT NULL,
    "texture" "Texture" NOT NULL,
    "body" "Body" NOT NULL,
    "acidity" "Acidity" NOT NULL,
    "bitterness" "Bitterness" NOT NULL,
    "roast" "Roast" NOT NULL,
    "color" "Color" NOT NULL,

    CONSTRAINT "Attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order_Product" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" REAL NOT NULL,
    "idProduct" TEXT NOT NULL,
    "idOrder" TEXT NOT NULL,

    CONSTRAINT "Order_Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favourite_Product" (
    "id" TEXT NOT NULL,
    "idUser" TEXT NOT NULL,
    "idProduct" TEXT NOT NULL,

    CONSTRAINT "Favourite_Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "rating" "Rating" NOT NULL,
    "idUser" TEXT,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "token" TEXT,
    "date" TIMESTAMP(3),
    "total" REAL,
    "idUser" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart_Product" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "idProduct" TEXT NOT NULL,
    "idCart" TEXT NOT NULL,

    CONSTRAINT "Cart_Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_email_key" ON "Auth"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_idAuth_key" ON "User"("idAuth");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_idAttribute_key" ON "Product"("idAttribute");

-- CreateIndex
CREATE UNIQUE INDEX "Order_idUser_key" ON "Order"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Product_idProduct_key" ON "Order_Product"("idProduct");

-- CreateIndex
CREATE UNIQUE INDEX "Order_Product_idOrder_key" ON "Order_Product"("idOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_idUser_key" ON "Cart"("idUser");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_idAuth_fkey" FOREIGN KEY ("idAuth") REFERENCES "Auth"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_idAttribute_fkey" FOREIGN KEY ("idAttribute") REFERENCES "Attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Product" ADD CONSTRAINT "Order_Product_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Product" ADD CONSTRAINT "Order_Product_idOrder_fkey" FOREIGN KEY ("idOrder") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite_Product" ADD CONSTRAINT "Favourite_Product_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite_Product" ADD CONSTRAINT "Favourite_Product_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Product" ADD CONSTRAINT "Cart_Product_idProduct_fkey" FOREIGN KEY ("idProduct") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Product" ADD CONSTRAINT "Cart_Product_idCart_fkey" FOREIGN KEY ("idCart") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
