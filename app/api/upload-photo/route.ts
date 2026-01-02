// ============================================
// Direct Photo Upload API Route
// Endpoint específico para React Native que no puede usar el SDK de UploadThing
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { UTApi } from 'uploadthing/server';

// Inicializar API de UploadThing
const utapi = new UTApi();

// ============================================
// Types
// ============================================

interface UploadResponse {
  success: boolean;
  url?: string;
  key?: string;
  size?: number;
  error?: string;
}

// ============================================
// POST Handler - Upload directo de imagen
// ============================================

export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    // Obtener el FormData de la request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }
    
    // Validar tipo de archivo
    if (!file.type?.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'El archivo debe ser una imagen' },
        { status: 400 }
      );
    }
    
    // Validar tamaño (máximo 4MB)
    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'La imagen excede el tamaño máximo de 4MB' },
        { status: 400 }
      );
    }
    
    const fileName = file.name || `photo_${Date.now()}.jpg`;
    
    console.log(`[Upload API] Recibido archivo: ${fileName}, tamaño: ${(file.size / 1024).toFixed(0)}KB`);
    
    // Subir a UploadThing usando la Server API
    const uploadResult = await utapi.uploadFiles(file);
    
    if (uploadResult.error) {
      console.error('[Upload API] Error de UploadThing:', uploadResult.error);
      return NextResponse.json(
        { success: false, error: uploadResult.error.message || 'Error al subir archivo' },
        { status: 500 }
      );
    }
    
    const { data } = uploadResult;
    
    if (!data) {
      return NextResponse.json(
        { success: false, error: 'No se recibió respuesta de UploadThing' },
        { status: 500 }
      );
    }
    
    console.log(`[Upload API] ✅ Subido exitosamente: ${data.url}`);
    
    return NextResponse.json({
      success: true,
      url: data.url,
      key: data.key,
      size: data.size,
    });
    
  } catch (error) {
    console.error('[Upload API] Error inesperado:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE Handler - Eliminar imagen
// ============================================

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const { key } = await request.json();
    
    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Se requiere la key del archivo' },
        { status: 400 }
      );
    }
    
    await utapi.deleteFiles(key);
    
    console.log(`[Upload API] ✅ Archivo eliminado: ${key}`);
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('[Upload API] Error eliminando archivo:', error);
    
    return NextResponse.json(
      { success: false, error: 'Error al eliminar archivo' },
      { status: 500 }
    );
  }
}
