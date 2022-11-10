/*
  Warnings:

  - Made the column `content` on table `Files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `html` on table `Files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sha` on table `Files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Files` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Files" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL
);
INSERT INTO "new_Files" ("content", "createdAt", "deletedAt", "html", "id", "postId", "sha", "title", "updatedAt", "userId") SELECT "content", "createdAt", "deletedAt", "html", "id", "postId", "sha", "title", "updatedAt", "userId" FROM "Files";
DROP TABLE "Files";
ALTER TABLE "new_Files" RENAME TO "Files";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
