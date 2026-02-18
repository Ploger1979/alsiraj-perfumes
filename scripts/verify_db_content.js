
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://alsiraj_admin-Ayman:alsiraj_admin1979!@alsirajdb.cbnhoqo.mongodb.net/alsiraj-perfumes?retryWrites=true&w=majority&appName=AlsirajDB";

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
