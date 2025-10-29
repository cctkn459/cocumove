import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import crypto from 'crypto';

// Configuración de Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_BUCKET_NAME || 'cocumove';

export interface UploadOptions {
  folder?: string;
  fileName?: string;
  contentType?: string;
}

export interface UploadResult {
  key: string;
  url: string;
  fileName: string;
  size: number;
}

/**
 * Subir archivo a Cloudflare R2
 */
export const uploadFile = async (
  fileBuffer: Buffer,
  originalFileName: string,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  try {
    const folder = options.folder || 'uploads';
    const fileExtension = path.extname(originalFileName);
    const fileName = options.fileName || `${crypto.randomBytes(8).toString('hex')}${fileExtension}`;
    const key = `${folder}/${fileName}`;
    const contentType = options.contentType || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    // Generar URL pública
    const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

    return {
      key,
      url,
      fileName,
      size: fileBuffer.length,
    };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
};

/**
 * Obtener URL firmada para descargar archivo
 */
export const getDownloadUrl = async (key: string, expiresIn: number = 3600): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    throw new Error(`Failed to get download URL: ${error}`);
  }
};

/**
 * Eliminar archivo de R2
 */
export const deleteFile = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error}`);
  }
};

/**
 * Subir foto de cédula (frente y dorso)
 */
export const uploadCedulaPhotos = async (
  frontBuffer: Buffer,
  backBuffer: Buffer,
  userId: string
): Promise<{ frontUrl: string; backUrl: string }> => {
  try {
    const frontResult = await uploadFile(frontBuffer, `cedula_front_${userId}.jpg`, {
      folder: `documents/${userId}/cedula`,
      contentType: 'image/jpeg',
    });

    const backResult = await uploadFile(backBuffer, `cedula_back_${userId}.jpg`, {
      folder: `documents/${userId}/cedula`,
      contentType: 'image/jpeg',
    });

    return {
      frontUrl: frontResult.url,
      backUrl: backResult.url,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Subir documentos de conductor
 */
export const uploadDriverDocuments = async (
  licenseBuffer: Buffer,
  backgroundCheckBuffer: Buffer,
  insuranceBuffer: Buffer,
  registrationBuffer: Buffer,
  userId: string
): Promise<{
  licenseUrl: string;
  backgroundCheckUrl: string;
  insuranceUrl: string;
  registrationUrl: string;
}> => {
  try {
    const licenseResult = await uploadFile(licenseBuffer, `license_${userId}.pdf`, {
      folder: `documents/${userId}/driver`,
      contentType: 'application/pdf',
    });

    const backgroundCheckResult = await uploadFile(backgroundCheckBuffer, `background_check_${userId}.pdf`, {
      folder: `documents/${userId}/driver`,
      contentType: 'application/pdf',
    });

    const insuranceResult = await uploadFile(insuranceBuffer, `insurance_${userId}.pdf`, {
      folder: `documents/${userId}/driver`,
      contentType: 'application/pdf',
    });

    const registrationResult = await uploadFile(registrationBuffer, `registration_${userId}.pdf`, {
      folder: `documents/${userId}/driver`,
      contentType: 'application/pdf',
    });

    return {
      licenseUrl: licenseResult.url,
      backgroundCheckUrl: backgroundCheckResult.url,
      insuranceUrl: insuranceResult.url,
      registrationUrl: registrationResult.url,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Subir foto de vehículo
 */
export const uploadVehiclePhoto = async (
  photoBuffer: Buffer,
  vehicleId: string
): Promise<string> => {
  try {
    const result = await uploadFile(photoBuffer, `vehicle_${vehicleId}.jpg`, {
      folder: `documents/vehicles`,
      contentType: 'image/jpeg',
    });

    return result.url;
  } catch (error) {
    throw error;
  }
};

/**
 * Subir foto de perfil
 */
export const uploadProfilePhoto = async (
  photoBuffer: Buffer,
  userId: string
): Promise<string> => {
  try {
    const result = await uploadFile(photoBuffer, `profile_${userId}.jpg`, {
      folder: `profiles`,
      contentType: 'image/jpeg',
    });

    return result.url;
  } catch (error) {
    throw error;
  }
};

