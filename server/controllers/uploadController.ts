import { Request, Response } from 'express';
import {
  uploadFile,
  uploadCedulaPhotos,
  uploadDriverDocuments,
  uploadVehiclePhoto,
  uploadProfilePhoto,
} from '../services/storageService';

export const uploadSingleFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await uploadFile(req.file.buffer, req.file.originalname, {
      folder: req.body.folder || 'uploads',
      contentType: req.file.mimetype,
    });

    res.status(200).json({
      message: 'File uploaded successfully',
      file: result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadCedulaPhotosHandler = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length < 2) {
      return res.status(400).json({ error: 'Two files required (front and back)' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const frontFile = req.files[0];
    const backFile = req.files[1];

    const result = await uploadCedulaPhotos(frontFile.buffer, backFile.buffer, req.user.userId);

    res.status(200).json({
      message: 'Cédula photos uploaded successfully',
      urls: result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadDriverDocumentsHandler = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length < 4) {
      return res.status(400).json({ error: 'Four files required (license, background check, insurance, registration)' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const licenseFile = req.files[0];
    const backgroundCheckFile = req.files[1];
    const insuranceFile = req.files[2];
    const registrationFile = req.files[3];

    const result = await uploadDriverDocuments(
      licenseFile.buffer,
      backgroundCheckFile.buffer,
      insuranceFile.buffer,
      registrationFile.buffer,
      req.user.userId
    );

    res.status(200).json({
      message: 'Driver documents uploaded successfully',
      urls: result,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadVehiclePhotoHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { vehicleId } = req.body;

    if (!vehicleId) {
      return res.status(400).json({ error: 'Vehicle ID is required' });
    }

    const url = await uploadVehiclePhoto(req.file.buffer, vehicleId);

    res.status(200).json({
      message: 'Vehicle photo uploaded successfully',
      url,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfilePhotoHandler = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const url = await uploadProfilePhoto(req.file.buffer, req.user.userId);

    res.status(200).json({
      message: 'Profile photo uploaded successfully',
      url,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

