
import mongoose, { Schema, Document } from 'mongoose';

export interface ProductSize {
    size: string;
    price: number;
    originalPrice?: number;
}

export interface IProduct extends Document {
    id: number; // Keeping legacy numeric ID if possible, or we might transition to _id
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    images?: string[];
    isFeatured?: boolean;
    isOffer?: boolean;
    category?: string;
    gender?: string;
    concentration?: string;
    notes?: string[];
    size?: string;
    sizes?: ProductSize[];
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    id: { type: Number, required: true, unique: true }, // Legacy ID support
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, required: true },
    images: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isOffer: { type: Boolean, default: false },
    category: { type: String },
    gender: { type: String },
    concentration: { type: String },
    notes: [{ type: String }],
    size: { type: String },
    sizes: [{
        size: { type: String },
        price: { type: Number },
        originalPrice: { type: Number }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Avoid OverwriteModelError upon hot reload
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
