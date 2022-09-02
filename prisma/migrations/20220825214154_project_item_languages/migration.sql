/*
  Warnings:

  - You are about to drop the column `language` on the `ProjectItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProjectItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "projectreeId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "languages" TEXT,
    "sourceLink" TEXT,
    "demoLink" TEXT,
    "date" DATETIME,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProjectItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProjectItem_projectreeId_fkey" FOREIGN KEY ("projectreeId") REFERENCES "Projectree" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProjectItem" ("authorId", "createdAt", "date", "demoLink", "description", "id", "image", "name", "position", "projectreeId", "sourceLink", "updatedAt") SELECT "authorId", "createdAt", "date", "demoLink", "description", "id", "image", "name", "position", "projectreeId", "sourceLink", "updatedAt" FROM "ProjectItem";
DROP TABLE "ProjectItem";
ALTER TABLE "new_ProjectItem" RENAME TO "ProjectItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
