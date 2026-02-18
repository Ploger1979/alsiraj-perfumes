
const mongoose = require('mongoose');

// New Connection String
const MONGODB_URI = "mongodb+srv://alsiraj_admin-Ayman:alsiraj_admin1979!@alsirajdb.cbnhoqo.mongodb.net/alsiraj-perfumes?retryWrites=true&w=majority&appName=AlsirajDB";

// Map of partial names to their CORRECT prices (in IQD)
const updates = [
    { name: "Pure Havane", price: 24000 },
    { name: "Travel Gift Set", price: 27000 },
    { name: "Baccarat Rouge", price: 30000 },
    { name: "Bad Boy", price: 22000 },
    { name: "Man In Black", price: 23000 },
    { name: "Bleu de Chanel", price: 25000 },
    { name: "Creed Aventus", price: 30000 }, // Be careful not to match "Set" if this runs first, order matters, or detailed match
    { name: "Original Santal", price: 26000 },
    { name: "Aventus Set", price: 29000 }, // Distinct from plain Aventus
    { name: "Fuel For Life", price: 18000 },
    { name: "Only The Brave", price: 19000 },
    { name: "Miss Dior", price: 24000 },
    { name: "J'adore", price: 25000 },
    { name: "The One", price: 23000 },
    { name: "Stronger With You Intensely", price: 23000 },
    { name: "Stronger With You Leather", price: 22000 },
    { name: "Armani Code", price: 24000 },
    { name: "Good Girl", price: 23000 },
    { name: "Boss Bottled", price: 21000 },
    { name: "Hugo Man", price: 20000 },
    { name: "Invictus Legend", price: 23000 }, // Specific first
    { name: "Invictus", price: 22000 },
    { name: "JOOP! Homme", price: 21000 },
    { name: "Joy by Dior", price: 24000 },
    { name: "K by Dolce", price: 23000 },
    { name: "Kirke", price: 26000 },
    { name: "Majeure d'Issey", price: 23000 },
    { name: "Millesime Imperial", price: 28000 },
    { name: "My Burberry", price: 24000 },
    { name: "Black XS", price: 22000 },
    { name: "Olympea Legend", price: 23000 },
    { name: "Pure XS", price: 22000 },
    { name: "Dior Sauvage", price: 25000 },
    { name: "Sì Intense", price: 24000 },
    { name: "Si Passione", price: 24000 },
    { name: "Terre d'Hermès", price: 25000 },
    { name: "Black Orchid", price: 26000 },
    { name: "Oud Wood", price: 27000 },
    { name: "Trussardi Donna", price: 22000 },
    { name: "Valentino Uomo", price: 24000 },
    { name: "Versace Eros", price: 23000 },
    { name: "Bombshell", price: 22000 },
    { name: "Very Sexy Orchid", price: 22000 }
];

async function updatePrices() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected!');

        const productsCollection = mongoose.connection.db.collection('products');

        for (const update of updates) {
            // Regex for case-insensitive partial match
            const regex = new RegExp(update.name, 'i');

            // Find matched product(s)
            const matched = await productsCollection.find({ name: { $regex: regex } }).toArray();

            if (matched.length === 0) {
                console.log(`⚠️ No match found for: "${update.name}"`);
            } else {
                for (const p of matched) {
                    console.log(`🔄 Updating "${p.name}"... Old: ${p.price} -> New: ${update.price}`);

                    // Update the ROOT price
                    await productsCollection.updateOne(
                        { _id: p._id },
                        {
                            $set: {
                                price: update.price,
                                // Also update sizes if they exist, assuming simple scalar for now or logic to scale
                                "sizes.0.price": update.price
                            }
                        }
                    );
                }
            }
        }

        console.log('✅ All updates finished.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

updatePrices();
