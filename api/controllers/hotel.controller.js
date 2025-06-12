import Hotel from '../models/Hotel.js';
import { uploadBase64Image } from '../utils/cloudinary.js';

//create
export const createHotel = async (req, res, next) => {
    try {
        let photosUrls = [];

        if (req.body.photos && Array.isArray(req.body.photos)) {
            for (const base64 of req.body.photos) {
                const result = await uploadBase64Image(base64, "hotels");
                photosUrls.push(result.secure_url);
            }
        }
        const newHotel = new Hotel({
            ...req.body,
            photos: photosUrls.length > 0 ? photosUrls : [],
        });
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel);
    } catch (err) {
        next(err);
    }
};

//update
export const updateHotel = async (req, res, next) => {
    const { name, photos } = req.body;
    const hotelId = req.params.id;
    try {
        const currentHotel = await Hotel.findById(hotelId);
        if (!currentHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        if (name && name !== currentHotel.name) {
            const existingHotel = await Hotel.findOne({ name });
            if (existingHotel && existingHotel._id.toString() !== hotelId) {
                return res.status(400).json({ message: "Hotel name is already in use!" });
            }
        }
        let photosUrls = currentHotel.photos || [];

        if (photos && Array.isArray(photos)) {
            for (const base64 of photos) {
                const result = await uploadBase64Image(base64, "hotels");
                photosUrls.push(result.secure_url);
            }
        }
        const updatedData = {
            ...req.body,
            photos: photosUrls,
        };
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, { $set: updatedData }, { new: true });
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }
};

//delete
export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json('Hotel has been deleted.');
    } catch (err) {
        next(err);
    }
};

//getByID
export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
};

//getAllHotels
export const getHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        next(error);
    }
};

//getCityByName
export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(',');
    try {
        const list = await Promise.all(
            cities.map((city) => {
                return Hotel.countDocuments({ city: city });
            })
        );
        res.status(200).json(list);
    } catch (error) {
        next(error);
    }
};

//getCountByType
export const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: 'Hotel' });
        const apartmentCount = await Hotel.countDocuments({
            type: 'Apartment',
        });
        const resortCount = await Hotel.countDocuments({ type: 'Resort' });
        const villaCount = await Hotel.countDocuments({ type: 'Villa' });

        res.status(200).json([
            {
                type: 'Hotel',
                count: hotelCount,
            },
            {
                type: 'Apartment',
                count: apartmentCount,
            },
            {
                type: 'Resort',
                count: resortCount,
            },
            {
                type: 'Villa',
                count: villaCount,
            },
        ]);
    } catch (error) {
        next(error);
    }
};

//getAllAccommodationByType
export const getAllAccommodationByType = async (req, res, next) => {
    const { type } = req.query;
    try {
        const accommodation = await Hotel.find({ type });
        res.status(200).json(accommodation);
    } catch (error) {
        next(error)
    }
}
