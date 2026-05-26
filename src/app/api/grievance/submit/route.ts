import { NextResponse } from 'next/server';
import { parseAndRouteGrievance } from '@/lib/grievance-parser';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Valid text is required' }, { status: 400 });
    }

    const payload = await parseAndRouteGrievance(text);

    return NextResponse.json({
      success: true,
      message: "Grievance successfully parsed and routed",
      data: payload
    });

  } catch (error) {
    console.error("Grievance Submit Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
