
const mongoose = require('mongoose');

// Hardcoded for diagnostic purpose
const MONGODB_URI = "mongodb+srv://alsiraj_admin-Ayman:alsiraj_admin1979!@alsirajdb.cbnhoqo.mongodb.net/alsiraj-perfumes?retryWrites=true&w=majority&appName=AlsirajDB";

console.log('Testing MongoDB Connection...');
// Mask password in log
console.log('URI:', MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

async function testConnection() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected successfully!');

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in DB:', collections.map(c => c.name));

        // Count products
        const collectionName = 'products';
        const count = await mongoose.connection.db.collection(collectionName).countDocuments();
        console.log(`📦 Count in '${collectionName}':`, count);

        if (count > 0) {
            const sample = await mongoose.connection.db.collection(collectionName).findOne();
            console.log('🔍 Sample Document:', sample);
        } else {
            console.log('⚠️ Collection is empty or not found.');
        }

        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (error) {
        console.error('❌ Connection Error:', error);
    }
}

testConnection();
