-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuthTokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiredReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id", "token")
);
INSERT INTO "new_AuthTokens" ("createdAt", "deletedAt", "expiredReason", "id", "token", "updatedAt", "userId") SELECT "createdAt", "deletedAt", "expiredReason", "id", "token", "updatedAt", "userId" FROM "AuthTokens";
DROP TABLE "AuthTokens";
ALTER TABLE "new_AuthTokens" RENAME TO "AuthTokens";
CREATE UNIQUE INDEX "AuthTokens_id_token_key" ON "AuthTokens"("id", "token");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
