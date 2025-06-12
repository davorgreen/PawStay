import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBase64Image = (base64, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            base64,
            { folder },
            (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            }
        );
    });
};
