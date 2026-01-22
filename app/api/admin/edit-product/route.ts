
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updatedData } = body;

        if (!id) {
            return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'data', 'products.ts');
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // 1. Find the product block robustly (counting braces)
        const idString = `id: ${id}`;
        // Regex to find "id: 123" or "id: '123'" or '"id": 123'
        // We assume typical format in the file.
        const idRegex = new RegExp(`\\b${idString}\\b`);
        const idMatch = fileContent.match(idRegex);

        if (!idMatch || idMatch.index === undefined) {
            // Fallback for string id or different spacing
            // Try strict simple match first
            return NextResponse.json({ error: 'لم يتم العثور على المنتج لتعديله (ID mismatch)' }, { status: 404 });
        }

        const idIndex = idMatch.index;

        // Search BACKWARDS from idIndex to find the opening brace '{'
        // This assumes the file is well-formed.
        let startIndex = -1;
        for (let i = idIndex; i >= 0; i--) {
            if (fileContent[i] === '{') {
                startIndex = i;
                break;
            }
        }

        if (startIndex === -1) {
            return NextResponse.json({ error: 'خطأ في تنسيق الملف (Start brace not found)' }, { status: 500 });
        }

        // Find the matching closing brace '}'
        let depth = 0;
        let endIndex = -1;
        for (let i = startIndex; i < fileContent.length; i++) {
            if (fileContent[i] === '{') depth++;
            if (fileContent[i] === '}') depth--;
            if (depth === 0) {
                endIndex = i;
                break;
            }
        }

        if (endIndex === -1) {
            return NextResponse.json({ error: 'خطأ في تنسيق الملف (End brace not found)' }, { status: 500 });
        }

        const originalBlock = fileContent.substring(startIndex, endIndex + 1);
        let newBlock = originalBlock;

        // Helper to replace property value
        const replaceProp = (key: string, value: any, isString: boolean = false, isArray: boolean = false) => {
            // Regex matches: key: value, OR key: "value",
            // Covers multiline arrays too if we are careful
            // We use a specific regex for the key that expects it to be a property key
            // ^\s*key: or \s+key:

            const regex = new RegExp(`(\\s+${key}\\s*:\\s*)([^,}\n]+(?:\\n\\s*[^,}\n]+)*?)(,?\\s*$)`, 'm');
            // This simple regex is risky for arrays/objects. 
            // Better strategy: Use the specific format we know we generate, or replace specifically.

            // For simple fields (name, description, price, booleans):
            // Match: key: "..." or key: 123
            if (isArray) {
                // For images: [...]
                // Match key: [ ... ]
                // We need balanced bracket matching for arrays if we want to be 100% safe, 
                // but for now we assume images is flat strings or standard format.
                const arrayRegex = new RegExp(`(\\s+${key}\\s*:\\s*\\[)([\\s\\S]*?)(\\])`, '');
                if (arrayRegex.test(newBlock)) {
                    newBlock = newBlock.replace(arrayRegex, `$1${value}$3`);
                } else {
                    // If property didn't exist, ignore (or add it? We should add it if missing)
                    // For now, let's assume existence or just append to end if critical fields.
                }
                return;
            }

            // For non-array values
            let formattedValue = value;
            if (isString) formattedValue = `"${value}"`;

            const propRegex = new RegExp(`(\\b${key}\\s*:\\s*)(["']?.*["']?|\\d+|true|false)(,?)`);
            if (propRegex.test(newBlock)) {
                newBlock = newBlock.replace(propRegex, `$1${formattedValue}$3`);
            } else {
                // Property missing, insert it before the closing brace
                // Find last line before closing brace?
                // Simple append
                const insertPos = newBlock.lastIndexOf('}');
                if (insertPos !== -1) {
                    newBlock = newBlock.substring(0, insertPos) + `    ${key}: ${formattedValue},\n${newBlock.substring(insertPos)}`;
                }
            }
        };

        // Simpler replacement strategy: 
        // Since we know the structure of the data file (TS object), we can use simpler regexes 
        // that match `key: value` patterns. 

        // Update Name
        newBlock = newBlock.replace(/name\s*:\s*".*?"/, `name: "${updatedData.name}"`);

        // Update Description (handle potential quotes in description?)
        // Clean description of double quotes to avoid syntax error
        const cleanDesc = updatedData.description.replace(/"/g, "'").replace(/\n/g, " ");
        newBlock = newBlock.replace(/description\s*:\s*".*?"/, `description: "${cleanDesc}"`);

        // Update Category, Gender, Concentration, Size (Strings)
        newBlock = newBlock.replace(/category\s*:\s*".*?"/, `category: "${updatedData.category}"`);
        newBlock = newBlock.replace(/gender\s*:\s*".*?"/, `gender: "${updatedData.gender}"`);
        newBlock = newBlock.replace(/concentration\s*:\s*".*?"/, `concentration: "${updatedData.concentration}"`);
        if (updatedData.size) {
            if (/size\s*:\s*".*?"/.test(newBlock)) {
                newBlock = newBlock.replace(/size\s*:\s*".*?"/, `size: "${updatedData.size}"`);
            } else {
                // Add size if missing
                newBlock = newBlock.replace(/(\s*)isFeatured/, `$1size: "${updatedData.size}",\n$1isFeatured`);
            }
        }

        // Update Booleans
        newBlock = newBlock.replace(/isFeatured\s*:\s*(true|false)/, `isFeatured: ${updatedData.isFeatured}`);

        // Handle isOffer and Prices
        const isOffer = updatedData.isOffer || false;

        // Update isOffer
        if (/isOffer\s*:\s*(true|false)/.test(newBlock)) {
            newBlock = newBlock.replace(/isOffer\s*:\s*(true|false)/, `isOffer: ${isOffer}`);
        } else {
            // Append if missing
            const insertPos = newBlock.lastIndexOf('}');
            newBlock = newBlock.substring(0, insertPos) + `    isOffer: ${isOffer},\n${newBlock.substring(insertPos)}`;
        }

        // Handle Prices
        // We need to be careful not to replace `price` inside `sizes` array.
        // We target `price:` that is indented similarly to `name:` or top level.
        // Assuming indentation of 4 or 8 spaces.
        // Or simply match `price:` that appears before `image:`?

        const price = isOffer ? updatedData.salePrice : updatedData.price;
        const originalPrice = isOffer ? updatedData.price : undefined;

        // Replace main price
        // Matches `price: 123` or `price: "123"`
        // Use a lookahead to ensure we are editing the main props?
        // Let's assume the main 'price' comes before 'image' or 'images'.
        newBlock = newBlock.replace(/(\s+price\s*:\s*)(["']?[\d.-]+["']?)/, `$1${price}`);

        // Handle Original Price
        const hasOriginalPrice = /(\s+originalPrice\s*:\s*)(["']?[\d.-]+["']?)/.test(newBlock);

        if (isOffer) {
            if (hasOriginalPrice) {
                newBlock = newBlock.replace(/(\s+originalPrice\s*:\s*)(["']?[\d.-]+["']?)/, `$1${originalPrice}`);
            } else {
                // Add originalPrice after price
                newBlock = newBlock.replace(/(price\s*:\s*["']?[\d.-]+["']?,?)/, `$1\n        originalPrice: ${originalPrice},`);
            }
        } else {
            // Remove originalPrice if exists
            if (hasOriginalPrice) {
                newBlock = newBlock.replace(/\s+originalPrice\s*:\s*["']?[\d.-]+["']?,?/, '');
            }
        }

        // Update Image (Main)
        newBlock = newBlock.replace(/image\s*:\s*".*?"/, `image: "${updatedData.image}"`);

        // Update Images Array
        // We accept that we might overwrite it completely
        // Safest way: Find `images: [` and match until `]`
        if (updatedData.images && updatedData.images.length > 0) {
            const imagesJson = JSON.stringify(updatedData.images); // ["url1", "url2"]
            // Find existing images block
            // CAREFUL: This regex `images\s*:\s*\[[\s\S]*?\]` matches until first `]`.
            // JSON.stringify output does not contain `]` inside strings usually, so it's safe-ish.
            // But existing content might be formatted multiline.

            if (/images\s*:\s*\[/.test(newBlock)) {
                newBlock = newBlock.replace(/images\s*:\s*\[[\s\S]*?\]/, `images: ${imagesJson}`);
            } else {
                // add images
                newBlock = newBlock.replace(/(image\s*:\s*".*?",?)/, `$1\n        images: ${imagesJson},`);
            }
        }

        // 4. Reconstruct file
        const finalContent = fileContent.substring(0, startIndex) + newBlock + fileContent.substring(endIndex + 1);

        fs.writeFileSync(filePath, finalContent, 'utf8');

        return NextResponse.json({ success: true, message: 'تم تحديث بيانات المنتج بنجاح' });

    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'فشل تحديث المنتج: ' + (error as Error).message }, { status: 500 });
    }
}
