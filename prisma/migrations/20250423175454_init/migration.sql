-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uniqueLogin" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UserPass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "host" TEXT NOT NULL,
    "hashPass" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "isLeaked" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserPass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AlertUserServiceList" (
    "alertServiceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "typeServiceId" INTEGER NOT NULL,
    "loginServiceId" TEXT NOT NULL,
    CONSTRAINT "AlertUserServiceList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlertUserServiceList_typeServiceId_fkey" FOREIGN KEY ("typeServiceId") REFERENCES "TypeService" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TypeService" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nameService" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueLogin_key" ON "User"("uniqueLogin");
