import { Router } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middleware/auth';
import {
  uploadSingleFile,
  uploadCedulaPhotosHandler,
  uploadDriverDocumentsHandler,
  uploadVehiclePhotoHandler,
  uploadProfilePhotoHandler,
} from '../controllers/uploadController';

const router = Router();

// Configurar multer para memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Validar tipos de archivo
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Proteger todas las rutas
router.use(authMiddleware);

// Rutas de carga
router.post('/single', upload.single('file'), uploadSingleFile);
router.post('/cedula', upload.array('files', 2), uploadCedulaPhotosHandler);
router.post('/driver-documents', upload.array('files', 4), uploadDriverDocumentsHandler);
router.post('/vehicle-photo', upload.single('file'), uploadVehiclePhotoHandler);
router.post('/profile-photo', upload.single('file'), uploadProfilePhotoHandler);

export default router;

