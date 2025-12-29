import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyAuth } from "@/lib/auth-middleware";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * GET /api/emails/[emailId]/attachments - List or download attachments from Resend
 * 
 * Query params:
 * - attachmentId: specific attachment ID to download (optional)
 * 
 * Without attachmentId: Returns list of attachments
 * With attachmentId: Downloads specific attachment
 * 
 * NOTE: La API de attachments de Resend puede no estar disponible aún en el SDK de Node.js
 * Esta implementación es preparatoria para cuando esté disponible.
 * Documentación: https://resend.com/docs/api-reference/attachments/receiving
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { emailId: string } }
) {
  if (!verifyAuth(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { emailId } = params;
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get("attachmentId");

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Resend API key not configured" },
        { status: 500 }
      );
    }

    if (!emailId) {
      return NextResponse.json(
        { error: "emailId is required" },
        { status: 400 }
      );
    }

    // NOTE: La API de attachments puede no estar disponible en el SDK actual
    // Alternativa: Usar API REST directamente con fetch
    // Si específico attachment solicitado, intentar descargarlo
    if (attachmentId) {
      try {
        // Usando API REST directamente
        const response = await fetch(
          `https://api.resend.com/emails/${emailId}/attachments/${attachmentId}`,
          {
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          const error = await response.json();
          return NextResponse.json(
            { error: "Failed to fetch attachment from Resend", details: error },
            { status: response.status }
          );
        }

        const data = await response.json();
        return NextResponse.json({
          attachment: data,
          source: 'resend_api',
        });
      } catch (error) {
        console.error("Resend attachment error:", error);
        return NextResponse.json(
          { error: "Failed to fetch attachment from Resend" },
          { status: 500 }
        );
      }
    }

    // Listar todos los attachments para este email usando API REST
    try {
      const response = await fetch(
        `https://api.resend.com/emails/${emailId}/attachments`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return NextResponse.json(
          { error: "Failed to fetch attachments from Resend", details: error },
          { status: response.status }
        );
      }

      const data = await response.json();

      // Transform attachments to our format
      const attachments = (data?.data || []).map((att: any) => ({
        id: att.id,
        filename: att.filename || 'attachment',
        contentType: att.content_type || att.contentType || 'application/octet-stream',
        size: att.size || 0,
      }));

      return NextResponse.json({
        attachments,
        total: attachments.length,
        source: 'resend_api',
      });
    } catch (error) {
      console.error("Resend attachments list error:", error);
      return NextResponse.json(
        { error: "Failed to fetch attachments from Resend" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching attachments from Resend:", error);
    return NextResponse.json(
      { error: "Failed to fetch attachments from Resend" },
      { status: 500 }
    );
  }
}
