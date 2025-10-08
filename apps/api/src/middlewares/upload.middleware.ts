import multer from "multer";
import path from "node:path";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (request, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = path.extname(file.originalname).toLowerCase();
    const isValidType = allowedTypes.test(extName);
    if (!isValidType) {
      return cb(new Error("Only images are allowed!"));
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 },
});
