// routes/booking.js
import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { bookingAccommodation } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", verifyToken, bookingAccommodation);

export default router;
