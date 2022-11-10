/*
  Warnings:

  - You are about to drop the `PostAuthors` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PostAuthors";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "visibility" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "expiresAt" DATETIME,
    "parentId" TEXT,
    "description" TEXT,
    "authorId" TEXT NOT NULL
);
INSERT INTO "new_Posts" ("createdAt", "deletedAt", "description", "expiresAt", "id", "parentId", "password", "title", "updatedAt", "visibility") SELECT "createdAt", "deletedAt", "description", "expiresAt", "id", "parentId", "password", "title", "updatedAt", "visibility" FROM "Posts";
DROP TABLE "Posts";
ALTER TABLE "new_Posts" RENAME TO "Posts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
