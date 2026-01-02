// ============================================
// UploadThing API Route - Next.js
// Backend handler for photo uploads
// ============================================

import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// ============================================
// File Router Configuration
// ============================================

export const ourFileRouter = {
  // Photo Journal Image Uploader
  photoJournalUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Aquí puedes agregar autenticación si lo deseas
      // Por ejemplo, verificar Firebase Auth token desde headers
      
      // const authHeader = req.headers.get("authorization");
      // if (!authHeader?.startsWith("Bearer ")) {
      //   throw new Error("Unauthorized");
      // }
      
      // const token = authHeader.substring(7);
      // const decodedToken = await admin.auth().verifyIdToken(token);
      
      return {
        uploadedAt: new Date().toISOString(),
        // userId: decodedToken.uid, // si usas auth
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este callback se ejecuta después de que la imagen se suba
      console.log("📸 Photo uploaded successfully!");
      console.log("File URL:", file.url);
      console.log("File Key:", file.key);
      console.log("File Size:", file.size);
      console.log("Metadata:", metadata);

      // Aquí puedes agregar lógica adicional como:
      // - Guardar en base de datos
      // - Enviar notificación
      // - Procesamiento de imagen adicional
      // - Analytics

      return {
        uploadedAt: metadata.uploadedAt,
        url: file.url,
        key: file.key,
        size: file.size,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// ============================================
// Route Handlers (GET & POST)
// ============================================

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
  // Opcional: configuración adicional
  config: {
    // uploadthingId: process.env.UPLOADTHING_APP_ID,
    // uploadthingSecret: process.env.UPLOADTHING_SECRET,
  },
});
