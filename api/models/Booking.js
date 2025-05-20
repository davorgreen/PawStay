import mongoose, { mongo } from "mongoose";


const bookingSchema = new mongoose.Schema({
    accommodationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        adults: { type: Number, required: true },
        children: { type: Number, default: 0 }
    },

}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema);