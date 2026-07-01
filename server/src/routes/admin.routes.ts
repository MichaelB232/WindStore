// src/routes/admin.routes.ts
import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middlewares/auth.middlewares";
import * as ProductController from "../controllers/product.controller";
import * as BrandController from "../controllers/brand.controller";
import * as CategoryController from "../controllers/category.controller";
import * as ProductConfigController from "../controllers/productConfig.controller";
import * as ProductFeatureController from "../controllers/productFeature.controller";
import * as UserController from "../controllers/user.controller";
import * as ReviewController from "../controllers/review.controller";
import * as ProductImageController from "../controllers/productImage.controller";
import { upload } from "../lib/multer";
import { writeLimiter } from "../middlewares/rateLimiter";
const router = Router();

router.use(authenticate, authorizeAdmin);

// Products
router.get("/products", ProductController.getAllProductsAdmin);
router.get("/products/create", ProductController.getProductsFormData); //For display input product
router.get("/products/:id/edit", ProductController.getProductEditData); //For display input edit
router.post(
  "/products",
  writeLimiter,
  upload.single("image"),
  ProductController.createProduct,
);
router.put(
  "/products/:id",
  writeLimiter,
  upload.single("image"),
  ProductController.updateProduct,
);
router.delete("/products/:id", writeLimiter, ProductController.deleteProduct);

// Brands
router.get("/brands", BrandController.getAllBrands);
router.get("/brands/:id", BrandController.getBrandById);
router.get("/brands/:name", BrandController.getBrandByName);
router.post("/brands", writeLimiter, BrandController.createBrands);
router.put("/brands/:id", writeLimiter, BrandController.updateBrands);
router.delete("/brands/:id", writeLimiter, BrandController.deleteBrand);

// Categories
router.get("/categories", CategoryController.getAllCategories);
router.post("/categories", writeLimiter, CategoryController.createCategory);
router.put("/categories/:id", writeLimiter, CategoryController.updateCategory);
router.delete(
  "/categories/:id",
  writeLimiter,
  CategoryController.deleteCategory,
);

// Product Configs
router.post(
  "/configs",
  writeLimiter,
  ProductConfigController.createProductConfig,
);
router.put(
  "/configs/:id",
  writeLimiter,
  ProductConfigController.updateProductConfig,
);
router.delete(
  "/configs/:id",
  writeLimiter,
  ProductConfigController.deleteProductConfig,
);

// Product Features
router.post(
  "/features",
  writeLimiter,
  ProductFeatureController.createProductFeature,
);
router.put(
  "/features/:id",
  writeLimiter,
  ProductFeatureController.updateProductFeature,
);
router.delete(
  "/features/:id",
  writeLimiter,
  ProductFeatureController.deleteProductFeature,
);

// Users
router.get("/users", UserController.getAllUsers);
router.delete("/users/:id", writeLimiter, UserController.deleteUser);

// Reviews
router.delete("/reviews/:id", writeLimiter, ReviewController.deleteReview);

// Images
router.post(
  "/images",
  writeLimiter,
  upload.single("image"),
  ProductImageController.addProductImage,
);
router.put(
  "/images/:id",
  writeLimiter,
  ProductImageController.updateProductImage,
);
router.delete(
  "/images/:id",
  writeLimiter,
  ProductImageController.deleteProductImage,
);
export default router;
