/*
  Warnings:

  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
-- Dropping existing foreign keys so we can re-add them with CASCADE behavior
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AlterTable
-- Adding updatedAt with DEFAULT CURRENT_TIMESTAMP so existing 12 rows get a value
-- Without DEFAULT this would fail because updatedAt is NOT NULL and existing rows have no value
ALTER TABLE "Conversation" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
-- Re-adding Conversation → User foreign key with ON DELETE CASCADE
-- Effect: deleting a User automatically deletes all their Conversations
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
-- Re-adding Message → Conversation foreign key with ON DELETE CASCADE
-- Effect: deleting a Conversation automatically deletes all its Messages
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;