import multer from "multer";
import path from "node:path";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, "public");
    },
    filename: (request, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${file.originalname}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}`);
    },
  }),
  fileFilter: (request, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = path.extname(file.originalname);
    const isValidType = allowedTypes.test(extName);
    if (!isValidType) {
      return cb(new Error("Only images are allowed!"));
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 },
});
