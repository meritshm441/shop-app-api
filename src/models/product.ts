import mongoose, { Schema, type Document } from "mongoose"

export interface IProduct extends Document {
  name: string
  category: string
  price: number
  description?: string
  image: {
    thumbnail: string
    mobile: string
    tablet: string
    desktop: string
  }
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: {
      thumbnail: { type: String, required: true },
      mobile: { type: String, required: true },
      tablet: { type: String, required: true },
      desktop: { type: String, required: true },
    },
  },
  { timestamps: true },
)

// Prevent model overwrite error during hot reloading in development
export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

