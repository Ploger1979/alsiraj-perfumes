
const mongoose = require('mongoose');

require('dotenv').config({ path: '.env.local' });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    images: [String]
}, { strict: false });

const Product = mongoose.model('Product', productSchema);

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        console.log('Finding products matching "Sauvage"...');
        const products = await Product.find({ name: { $regex: 'Sauvage', $options: 'i' } });

        if (products.length === 0) {
            console.log('No products found.');
            return;
        }

        for (const p of products) {
            console.log(`Processing: ${p.name}`);
            const oldImagesCount = p.images ? p.images.length : 0;

            if (p.image) {
                // Determine if we should really reset.
                // The user wants to remove "deleted" images.
                // The safest is to keep ONLY the main image if confirmed.
                // Or if p.images has > 1 item, reset to [p.image].

                if (oldImagesCount > 1) {
                    console.log(`  - Found ${oldImagesCount} images. Resetting to main image only: ${p.image}`);
                    p.images = [p.image];
                    await p.save();
                    console.log('  - Updated successfully.');
                } else {
                    console.log('  - Images array already has 1 or 0 items. Skipping.');
                }
            } else {
                console.log('  - No main image set. Skipping.');
            }
        }

        console.log('Done!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

run();
