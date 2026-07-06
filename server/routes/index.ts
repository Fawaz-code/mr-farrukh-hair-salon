import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appointmentsRouter from "./appointments";
import servicesRouter from "./services";
import pricingRouter from "./pricing";
import galleryRouter from "./gallery";
import testimonialsRouter from "./testimonials";
import staffRouter from "./staff";
import contactRouter from "./contact";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/appointments", appointmentsRouter);
router.use("/services", servicesRouter);
router.use("/pricing", pricingRouter);
router.use("/gallery", galleryRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/staff", staffRouter);
router.use("/contact", contactRouter);
router.use("/chat", chatRouter);

export default router;
