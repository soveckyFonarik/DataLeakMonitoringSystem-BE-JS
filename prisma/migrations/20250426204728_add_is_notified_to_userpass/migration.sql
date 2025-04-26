/*
  Warnings:

  - You are about to drop the column `isNotified` on the `AlertUserServiceList` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlertUserServiceList" (
    "alertServiceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "typeServiceId" INTEGER NOT NULL,
    "loginServiceId" TEXT NOT NULL,
    CONSTRAINT "AlertUserServiceList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlertUserServiceList_typeServiceId_fkey" FOREIGN KEY ("typeServiceId") REFERENCES "TypeService" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AlertUserServiceList" ("alertServiceId", "loginServiceId", "typeServiceId", "userId") SELECT "alertServiceId", "loginServiceId", "typeServiceId", "userId" FROM "AlertUserServiceList";
DROP TABLE "AlertUserServiceList";
ALTER TABLE "new_AlertUserServiceList" RENAME TO "AlertUserServiceList";
CREATE TABLE "new_UserPass" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "host" TEXT NOT NULL,
    "hashPass" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "isLeaked" BOOLEAN NOT NULL DEFAULT false,
    "isNotified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "UserPass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPass" ("hashPass", "host", "id", "isLeaked", "login", "userId") SELECT "hashPass", "host", "id", "isLeaked", "login", "userId" FROM "UserPass";
DROP TABLE "UserPass";
ALTER TABLE "new_UserPass" RENAME TO "UserPass";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
