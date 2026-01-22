
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string; // Will store hashed password
    role: 'admin' | 'editor';
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor'], default: 'admin' },
    createdAt: { type: Date, default: Date.now },
});

// Avoid OverwriteModelError upon hot reload
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
