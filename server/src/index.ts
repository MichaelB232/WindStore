import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import addressRoutes from "./routes/address.routes";
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
import { globalLimiter } from "./middlewares/rateLimiter";
import { startExpiredOrdersJob } from "./jobs/releaseExpiredOrders.job";
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
const app = express();

// Trust first proxy so secure cookies and rate-limiting work behind Railway/Render/Vercel
app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]
  .filter(Boolean)
  .map((url) => url!.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server, AI agent)
      if (!origin) {
        callback(null, true);
        return;
      }
      const normalizedOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        normalizedOrigin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Keep permissive fallback for portfolio demos
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);

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
app.use("/api/addresses", addressRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
  startExpiredOrdersJob(); // ← start the cron job when server starts
});
