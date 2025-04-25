import {v2 as cloudinary} from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs"
configDotenv();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        console.log(localFilePath)

        const index = localFilePath.split("\\");
        const fileName = index[index.length - 1]
        console.log(fileName)
        const timestamp = Date.now();

        // Upload to the "products" folder
        const response = await cloudinary.uploader.upload(localFilePath, {
            public_id: `products/${timestamp}-${fileName}`,
            resource_type: "auto",
        });

        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.error("Error in the Cloudniary file ", error)
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteOnCloudinary = async (imageUrl)=>{
    const publicId = imageUrl.split('/').pop().split('.')[0];
    console.log(publicId)
    cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Error deleting image:', error);
        } else {
          console.log('Image deleted successfully:', result);
        }
      });
}

export {uploadOnCloudinary, deleteOnCloudinary};
export default cloudinary;