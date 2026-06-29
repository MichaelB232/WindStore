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

const router = Router();

router.use(authenticate, authorizeAdmin);

// Products
router.get("/products", ProductController.getAllProductsAdmin);
router.get("/products/create", ProductController.getProductsFormData); //For display input product
router.get("/products/:id/edit", ProductController.getProductEditData); //For display input edit
router.post(
  "/products",
  upload.single("image"),
  ProductController.createProduct,
);
router.put(
  "/products/:id",
  upload.single("image"),
  ProductController.updateProduct,
);
router.delete("/products/:id", ProductController.deleteProduct);

// Brands
router.get("/brands", BrandController.getAllBrands);
router.post("/brands", BrandController.createBrands);
router.put("/brands/:id", BrandController.updateBrands);
router.delete("/brands/:id", BrandController.deleteBrand);

// Categories
router.get("/categories", CategoryController.getAllCategories);
router.post("/categories", CategoryController.createCategory);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

// Product Configs
router.post("/configs", ProductConfigController.createProductConfig);
router.put("/configs/:id", ProductConfigController.updateProductConfig);
router.delete("/configs/:id", ProductConfigController.deleteProductConfig);

// Product Features
router.post("/features", ProductFeatureController.createProductFeature);
router.put("/features/:id", ProductFeatureController.updateProductFeature);
router.delete("/features/:id", ProductFeatureController.deleteProductFeature);

// Users
router.get("/users", UserController.getAllUsers);
router.delete("/users/:id", UserController.deleteUser);

// Reviews
router.delete("/reviews/:id", ReviewController.deleteReview);

// Images
router.post(
  "/images",
  upload.single("image"),
  ProductImageController.addProductImage,
);
router.put("/images/:id", ProductImageController.updateProductImage);
router.delete("/images/:id", ProductImageController.deleteProductImage);
export default router;
