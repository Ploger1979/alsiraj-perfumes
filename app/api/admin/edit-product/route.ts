
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });
        }

        // 1. Fetch the existing product to get current state
        const product = await Product.findOne({ id: id });

        if (!product) {
            return NextResponse.json({ error: 'لم يتم العثور على المنتج لتعديله' }, { status: 404 });
        }

        const oldPrice = product.price;

        // 2. Prepare new values
        const isOffer = data.isOffer || false;
        let newPrice = Number(data.price);
        let newOriginalPrice = 0;

        if (isOffer) {
            newPrice = Number(data.salePrice);
            newOriginalPrice = Number(data.price);
        } else {
            newPrice = Number(data.price);
            newOriginalPrice = 0;
        }

        // 3. Update standard fields
        product.name = data.name;
        product.description = data.description;
        product.image = data.image;
        product.images = data.images;
        product.category = data.category;
        product.gender = data.gender;
        product.concentration = data.concentration;
        product.size = data.size; // Display size string
        product.isFeatured = data.isFeatured;
        product.isOffer = isOffer;
        product.notes = data.notes;

        // 4. Update Root Prices
        product.price = newPrice;
        product.originalPrice = newOriginalPrice;

        // 5. Market-Based Smart Pricing (Power Law Scaling)
        // Logic: 
        // 1. Identify valid size selected by Admin (Anchor).
        // 2. Scale other sizes using a "Perfume Market Curve" (approx exponent 0.8).
        //    This means doubling volume doesn't double price (e.g. 100ml is ~1.7x price of 50ml, not 2x).
        if (product.sizes && product.sizes.length > 0 && newPrice > 0) {

            // Helper to parse size volume (e.g. "50 ml" -> 50)
            const parseSize = (s: string) => {
                const flt = parseFloat(s.replace(/[^0-9.]/g, ''));
                return isNaN(flt) ? 0 : flt;
            };

            // 1. Determine the "Anchor" Size (The one the admin just edited)
            // We look for a size matching `data.size`. 
            // If not found, fall back to the first available size or the medium one.
            const anchorSizeLabel = data.size || product.size || product.sizes[0].size;
            const anchorVolume = parseSize(anchorSizeLabel);

            // 2. Identify the Anchor Price (The price the admin just typed)
            const anchorPrice = newPrice;
            const anchorOriginalPrice = isOffer ? newOriginalPrice : 0;

            if (anchorVolume > 0) {
                product.sizes = product.sizes.map((s: any) => {
                    const currentVol = parseSize(s.size);

                    // Safety check
                    if (currentVol <= 0) return s;

                    // If this is the Anchor Size, set it exactly to what admin typed
                    if (Math.abs(currentVol - anchorVolume) < 0.1) {
                        return {
                            ...s,
                            price: anchorPrice,
                            originalPrice: anchorOriginalPrice
                        };
                    }

                    // For other sizes, calculate based on Market Curve
                    // Formula: P2 = P1 * (V2 / V1) ^ 0.8
                    // The 0.8 exponent creates the "discount" curve (standard in perfume industry)
                    const ratio = currentVol / anchorVolume;
                    const scaleFactor = Math.pow(ratio, 0.8);

                    const calculatedPrice = Math.ceil((anchorPrice * scaleFactor) / 250) * 250;

                    let calculatedOriginalPrice = 0;
                    if (anchorOriginalPrice > 0) {
                        calculatedOriginalPrice = Math.ceil((anchorOriginalPrice * scaleFactor) / 250) * 250;
                    }

                    return {
                        ...s,
                        price: calculatedPrice,
                        originalPrice: calculatedOriginalPrice
                    };
                });
            }
        }

        // 6. Save changes
        await product.save();

        return NextResponse.json({ success: true, message: 'تم تحديث بيانات المنتج والأسعار بذكاء', product });
    } catch (error) {
        console.error('Update error:', error);
        return NextResponse.json({ error: 'فشل تحديث المنتج' }, { status: 500 });
    }
}
