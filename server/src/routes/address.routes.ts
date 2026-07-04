import { Router } from "express";
import { authenticate } from "../middlewares/auth.middlewares";
import { writeLimiter } from "../middlewares/rateLimiter";
import * as AddressController from "../controllers/address.controller";

const router = Router();

router.use(authenticate); // Require Login

router.get("/", AddressController.getMyAddresses);
router.get("/:id", AddressController.getAddressById);
router.post("/", writeLimiter, AddressController.createAddress);
router.put("/:id", writeLimiter, AddressController.updateAddress);
router.patch("/:id/default", writeLimiter, AddressController.setDefaultAddress); // <- set default
router.delete("/:id", writeLimiter, AddressController.deleteAddress);

export default router;
