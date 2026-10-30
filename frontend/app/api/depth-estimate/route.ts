import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const externalBackendUrl = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL;
    if (externalBackendUrl && externalBackendUrl.startsWith("http")) {
      try {
        const formData = await req.formData();
        const resp = await fetch(`${externalBackendUrl.replace(/\/$/, "")}/api/depth-estimate`, {
          method: "POST",
          body: formData,
          signal: AbortSignal.timeout(5000),
        });
        if (resp.ok) {
          return NextResponse.json(await resp.json());
        }
      } catch (err) {
        console.warn("External depth estimation failed, using fallback:", err);
      }
    }

    return NextResponse.json({
      status: "success",
      depth_map_base64: "", // Three.js will use client-side instant canvas depth generator
      model: "Client-Assisted Monocular Depth Estimation",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
