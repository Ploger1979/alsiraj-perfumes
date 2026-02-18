
const mongoose = require('mongoose');

// OLD DB (Source)
const OLD_URI = 'mongodb+srv://zusammen:Berlin2026@al-raha-db.vg5sa6r.mongodb.net/alsiraj-perfumes?retryWrites=true&w=majority';

// NEW DB (Target)
const NEW_URI = "mongodb+srv://alsiraj_admin-Ayman:alsiraj_admin1979!@alsirajdb.cbnhoqo.mongodb.net/alsiraj-perfumes?retryWrites=true&w=majority&appName=AlsirajDB";

async function syncImages() {
    try {
        console.log('1. Connecting to OLD DB...');
        const oldConn = await mongoose.createConnection(OLD_URI).asPromise();
        console.log('✅ Connected to OLD DB');

        console.log('2. Connecting to NEW DB...');
        const newConn = await mongoose.createConnection(NEW_URI).asPromise();
        console.log('✅ Connected to NEW DB');

        // Define schem (loose)
        const schema = new mongoose.Schema({}, { strict: false });
        const OldProduct = oldConn.model('Product', schema, 'products');
        const NewProduct = newConn.model('Product', schema, 'products');

        // Fetch all from old
        console.log('3. Fetching products from OLD DB...');
        const oldProducts = await OldProduct.find({});
        console.log(`   Found ${oldProducts.length} products in OLD DB.`);

        let updatedCount = 0;

        // Iterate and update new
        for (const oldP of oldProducts) {
            if (!oldP.image) continue;

            const isCloudinary = oldP.image.includes('cloudinary') || oldP.image.startsWith('http');

            // Should we update? Let's assume OLD DB has the "correct" images the user misses.
            if (isCloudinary) {
                // Find in new DB
                const newP = await NewProduct.findOne({ name: oldP.name });

                if (newP) {
                    let needsUpdate = false;

                    if (newP.image !== oldP.image) {
                        console.log(`   -> Updating Image for "${newP.name}"`);
                        console.log(`      FROM: ${newP.image}`);
                        console.log(`      TO:   ${oldP.image}`);
                        newP.image = oldP.image;
                        needsUpdate = true;
                    }

                    if (JSON.stringify(newP.images) !== JSON.stringify(oldP.images)) {
                        console.log(`      Updating Images Array for "${newP.name}"`);
                        newP.images = oldP.images;
                        needsUpdate = true;
                    }

                    if (needsUpdate) {
                        await newP.save();
                        updatedCount++;
                    }
                }
            }
        }

        console.log(`✅ Sync Complete. Updated ${updatedCount} products.`);

        await oldConn.close();
        await newConn.close();

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

syncImages();
