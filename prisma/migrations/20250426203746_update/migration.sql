-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AlertUserServiceList" (
    "alertServiceId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "typeServiceId" INTEGER NOT NULL,
    "loginServiceId" TEXT NOT NULL,
    "isNotified" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AlertUserServiceList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AlertUserServiceList_typeServiceId_fkey" FOREIGN KEY ("typeServiceId") REFERENCES "TypeService" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AlertUserServiceList" ("alertServiceId", "loginServiceId", "typeServiceId", "userId") SELECT "alertServiceId", "loginServiceId", "typeServiceId", "userId" FROM "AlertUserServiceList";
DROP TABLE "AlertUserServiceList";
ALTER TABLE "new_AlertUserServiceList" RENAME TO "AlertUserServiceList";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
