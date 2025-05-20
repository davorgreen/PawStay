import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRoute from './routes/auth.js'
import usersRoute from './routes/users.js'
import hotelsRoute from './routes/hotels.js'
import bookingRoute from './routes/booking.js'
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to the mongoDB!");
    } catch (error) {
        throw error;
    }
}

//middlewares
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/bookings", bookingRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
})

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
})

app.listen(8800, () => {
    connect();
    console.log("Connected to the backend!");
})