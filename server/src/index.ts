import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import shopRoutes from "./routes/shop.routes";
import cartRoutes from "./routes/cart.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import brandRoutes from "./routes/brand.routes";
import reviewRoutes from "./routes/review.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import productConfigRoutes from "./routes/productConfig.routes";
import adminRoutes from "./routes/admin.routes";
import cookieParser from "cookie-parser";

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
app.use("/api/brand", brandRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/configs", productConfigRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
