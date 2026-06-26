import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import shopRoutes from "./routes/shop.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import cookieParser from "cookie-parser";

dotenv.config();

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
