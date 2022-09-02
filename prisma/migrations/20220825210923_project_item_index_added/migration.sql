-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "projectreeId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "language" TEXT,
    "sourceLink" TEXT,
    "demoLink" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectItem_projectreeId_fkey" FOREIGN KEY ("projectreeId") REFERENCES "Projectree" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectItem" ("authorId", "createdAt", "demoLink", "description", "id", "image", "language", "name", "projectreeId", "sourceLink", "updatedAt") SELECT "authorId", "createdAt", "demoLink", "description", "id", "image", "language", "name", "projectreeId", "sourceLink", "updatedAt" FROM "ProjectItem";
DROP TABLE "ProjectItem";
ALTER TABLE "new_ProjectItem" RENAME TO "ProjectItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
