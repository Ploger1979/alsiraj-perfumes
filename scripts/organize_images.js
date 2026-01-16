const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../imges/Alsiraj-NEW-FOTOS');
const targetBaseDir = path.join(__dirname, '../public/images/products');

if (!fs.existsSync(targetBaseDir)) {
    fs.mkdirSync(targetBaseDir, { recursive: true });
}

// Regex to capture the product name.
// Assumes format like "Name Of Product_01.ext" or "Name-Product-01.ext"
// It tries to capture everything before the last underscore or dash followed by numbers.
const nameCleanerRegex = /^(.*?)[\W_]*\d{1,2}\.(jpg|jpeg|png|webp|avif)$/i;
const nameCleanerAlternativeRegex = /^(.*)\.(jpg|jpeg|png|webp|avif)$/i;

async function processImages() {
    const files = fs.readdirSync(sourceDir);
    const productMap = new Map();

    files.forEach(file => {
        let productName = '';
        let match = file.match(nameCleanerRegex);

        if (match) {
            productName = match[1];
        } else {
            // Try alternative if no numbers found
            match = file.match(nameCleanerAlternativeRegex);
            if (match) {
                productName = match[1];
            } else {
                return; // Skip if unrecognizable
            }
        }

        // Clean up product name
        productName = productName
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Capitalize Words
        productName = productName.replace(/\b\w/g, l => l.toUpperCase());

        if (!productMap.has(productName)) {
            productMap.set(productName, []);
        }
        productMap.get(productName).push(file);
    });

    const generatedProducts = [];
    let idCounter = 100; // Start IDs from 100 for new products

    for (const [productName, fileList] of productMap.entries()) {
        const productFolder = path.join(targetBaseDir, productName);

        if (!fs.existsSync(productFolder)) {
            fs.mkdirSync(productFolder, { recursive: true });
        }

        // Sort files to try to preserve order (01, 02...)
        fileList.sort();

        // Take max 3
        const selected = fileList.slice(0, 3);
        const productImages = [];

        selected.forEach((file, index) => {
            const ext = path.extname(file);
            const safeName = productName.replace(/\s+/g, '-').toLowerCase();
            const newName = `${safeName}-${index + 1}${ext}`;

            const srcPath = path.join(sourceDir, file);
            const destPath = path.join(productFolder, newName);

            fs.copyFileSync(srcPath, destPath);
            productImages.push(`/images/products/${productName}/${newName}`);
        });

        generatedProducts.push({
            id: idCounter++,
            name: productName,
            description: "عطر مميز من السراج للعطور. يمنحك تجربة عطرية فريدة تدوم طويلاً.",
            price: 150000, // Placeholder
            image: productImages[0],
            images: productImages,
            category: "general", // Default
            gender: "للجنسين", // Default
            concentration: "Eau de Parfum",
            isFeatured: false,
            isOffer: false
            // omitting notes/sizes for automated batch
        });
    }

    console.log(`Processed ${generatedProducts.length} unique products.`);
    fs.writeFileSync(
        path.join(__dirname, 'new_products.json'),
        JSON.stringify(generatedProducts, null, 2)
    );
}

processImages();
