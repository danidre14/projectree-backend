-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Projectree" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "favicon" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'standard',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Projectree_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Projectree" ("authorId", "createdAt", "favicon", "id", "name", "theme", "title", "updatedAt") SELECT "authorId", "createdAt", "favicon", "id", "name", "theme", "title", "updatedAt" FROM "Projectree";
DROP TABLE "Projectree";
ALTER TABLE "new_Projectree" RENAME TO "Projectree";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
