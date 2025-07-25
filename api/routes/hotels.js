import express from 'express';
import { countByCity, countByType, createHotel, deleteHotel, getAllAccommodationByType, getHotel, getHotels, updateHotel } from '../controllers/hotel.controller.js';
import { verifyAdmin } from '../utils/verifyToken.js';


const router = express.Router();

//create
router.post('/', verifyAdmin, createHotel);

//update
router.put('/:id', verifyAdmin, updateHotel);

//delete
router.delete('/:id', verifyAdmin, deleteHotel);

//get
router.get('/find/:id', getHotel);

//get all
router.get('/', getHotels);
router.get('/countByCity', countByCity);
router.get('/countByType', countByType);

//getAccomodationByType
router.get('/byType', getAllAccommodationByType);



export default router;
