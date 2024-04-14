/*
  Warnings:

  - You are about to drop the `check_ins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_gym_id_fkey";

-- DropForeignKey
ALTER TABLE "check_ins" DROP CONSTRAINT "check_ins_user_id_fkey";

-- DropTable
DROP TABLE "check_ins";

-- CreateTable
CREATE TABLE "check-ins" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "gym_id" TEXT NOT NULL,

    CONSTRAINT "check-ins_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "check-ins" ADD CONSTRAINT "check-ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check-ins" ADD CONSTRAINT "check-ins_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
