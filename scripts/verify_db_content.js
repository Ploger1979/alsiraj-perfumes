
const mongoose = require('mongoose');

require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('--- DB Verification ---');

async function checkPrices() {
    try {
        await mongoose.connect(MONGODB_URI);
        const collection = mongoose.connection.db.collection('products');

        const products = await collection.find({}).limit(5).toArray(); // Get first 5 products

        console.log('\n--- First 5 Products ---');
        products.forEach(p => {
            console.log(`Name: ${p.name}`);
            console.log(`Price: ${p.price}`);
            console.log(`Image: ${p.image}`);
            console.log('-------------------------');
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPrices();
