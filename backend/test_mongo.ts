import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.DATABASE_URL || "";

async function test() {
    console.log("Testing with Native MongoDB Driver...");
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected successfully to Atlas");
        const db = client.db('reunify');
        const collections = await db.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
    } catch (e) {
        console.error("Native Driver Error:", e);
    } finally {
        await client.close();
    }
}
test();
