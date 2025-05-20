import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";

export const bookingAccommodation = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { location, checkInDate, checkOutDate, guests } = req.body;

        const accommodation = await Hotel.findOne({ name: location });
        if (!accommodation) return next(createError(404, 'No Hotel found'));

        const isHotelReserved = await Booking.findOne({
            accommodationId: accommodation._id,
            $or: [
                { checkIn: { $lt: checkOutDate, $gte: checkInDate } },
                { checkOut: { $gt: checkInDate, $lte: checkOutDate } },
                { checkIn: { $lte: checkInDate }, checkOut: { $gte: checkOutDate } }
            ]
        })
        if (isHotelReserved) return next(createError(404, 'Hotel is reserved'));

        const newBooking = new Booking({
            accommodationId: accommodation._id,
            userId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests
        })
        const savedBookings = await newBooking.save();
        res.status(201).json(savedBookings);
    } catch (err) {
        next(err)
    }

}