import cloudinary from "../lib/cloudinary";

export const uploadImage = async (
  file: Express.Multer.File,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "windstore/products", // organized in folders
          transformation: [
            { width: 800, height: 600, crop: "fill" }, // auto resize
            { quality: "auto" }, // auto optimize
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url); // ← this is the URL to save in DB
        },
      )
      .end(file.buffer);
  });
};
