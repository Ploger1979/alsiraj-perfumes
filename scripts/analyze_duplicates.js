
const fs = require('fs');
const path = require('path');

// I'll read the file content directly since it's a TS file and I can't require it easily without compilation
// I will parse it using regex or simple evaluation if possible, or just read the file text and extract the array.
// Since it's a simple export, I can read the text.

const productsFile = path.join(__dirname, '../data/products.ts');
const content = fs.readFileSync(productsFile, 'utf8');

// Extract the products array. It starts with 'export const products: Product[] = [' and ends with '];'
const match = content.match(/export const products: Product\[\] = \[([\s\S]*?)\];/);

if (!match) {
    console.log("Could not find products array.");
    process.exit(1);
}

// Dangerously eval the content (assuming it's just data objects)
// I need to handle 'export interface' and other TS syntax if I try to eval the whole file,
// but extracting the array content and evaling it as a JS array should work if it's standard JSON-like structure.
// However, there might be comments or specific TS constructs.
// A safer way is to regex for names and images.

const items = [];
const itemRegex = /{\s*id:\s*(\d+),[\s\S]*?name:\s*"([^"]+)"/g;
let itemMatch;

// Let's rely on text parsing for names and IDs
const entries = [];
const lines = match[1].split('\n');
let currentEntry = {};

lines.forEach(line => {
    line = line.trim();
    if (line.startsWith('id:')) currentEntry.id = line.split(':')[1].replace(',', '').trim();
    if (line.startsWith('name:')) currentEntry.name = line.split(':')[1].replace(/[",]/g, '').trim();
    if (line.startsWith('image:')) currentEntry.image = line.split(':')[1].replace(/[",]/g, '').trim();
    if (line === '},') {
        if (currentEntry.id) entries.push(currentEntry);
        currentEntry = {};
    }
});

// Identify duplicates
const nameMap = new Map();
const imageMap = new Map();
const duplicates = [];

entries.forEach(entry => {
    // Check Name
    if (nameMap.has(entry.name)) {
        duplicates.push({ type: 'Same Name', original: nameMap.get(entry.name), duplicate: entry });
    } else {
        nameMap.set(entry.name, entry);
    }

    // Check Image
    if (entry.image && imageMap.has(entry.image)) {
        duplicates.push({ type: 'Same Image', original: imageMap.get(entry.image), duplicate: entry });
    } else {
        imageMap.set(entry.image, entry);
    }
});

console.log("Found Duplicates:", JSON.stringify(duplicates, null, 2));
