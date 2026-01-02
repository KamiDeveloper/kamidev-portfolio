// ============================================
// UploadThing Core Configuration
// Shared configuration for UploadThing
// ============================================

import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

/**
 * File Router para Photo Journal
 * Maneja la subida de imágenes del feature "Un Día, Una Foto"
 */
export const ourFileRouter = {
  photoJournalUploader: f({ 
    image: { 
      maxFileSize: "1MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async ({ req }) => {
      // Middleware: se ejecuta antes de la subida
      // Aquí puedes agregar validación de autenticación
      
      return {
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // onUploadComplete: se ejecuta después de la subida exitosa
      console.log("Upload completado:", file.url);
      
      return {
        uploadedAt: metadata.uploadedAt,
        url: file.url,
        key: file.key,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
