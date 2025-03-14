import mongoose, { Schema, type Document } from "mongoose"

export interface ICartItem extends Document {
  productId: string
  quantity: number
}

const CartItemSchema: Schema = new Schema(
  {
    productId: { type: String, required: true, ref: "Product" },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

// Prevent model overwrite error during hot reloading in development
export default mongoose.models.CartItem || mongoose.model<ICartItem>("CartItem", CartItemSchema)

