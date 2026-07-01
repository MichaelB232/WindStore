import cron from "node-cron";
import { releaseExpiredOrders } from "../services/order.service";

export const startExpiredOrdersJob = () => {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running expired orders cleanup...");
    try {
      const result = await releaseExpiredOrders();
      console.log(`Released ${result.length} expired orders`);
    } catch (error) {
      console.error("Error releasing expired orders:", error);
    }
  });
};
