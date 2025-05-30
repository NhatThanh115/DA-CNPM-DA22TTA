import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  featured: boolean;
  inStock: boolean;
  publicationDate: Date;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true, index: true },
  rating: { type: Number, default: 0 },
  featured: { type: Boolean, default: false, index: true },
  inStock: { type: Boolean, default: true },
  publicationDate: { type: Date, required: true },
}, { timestamps: true });

export default mongoose.model<IBook>('Book', BookSchema);
