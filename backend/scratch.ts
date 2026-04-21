import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        const u = await prisma.user.findFirst();
        console.log("Success:", !!u);
    } catch (e) {
        console.error("Mongo Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
