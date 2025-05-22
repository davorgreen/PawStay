// routes/booking.js
import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { bookingAccommodation, getBookedDaysByHotelName } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", verifyToken, bookingAccommodation);

router.get('/:hotelName/reserved-dates', verifyToken, getBookedDaysByHotelName);

export default router;
