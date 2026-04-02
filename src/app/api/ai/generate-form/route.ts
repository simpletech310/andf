import { NextRequest, NextResponse } from "next/server";
import { generateRegistrationForm } from "@/lib/openai/form-generator";

export async function POST(req: NextRequest) {
  try {
    const { eventDescription } = await req.json();

    if (!eventDescription) {
      return NextResponse.json({ error: "Event description required" }, { status: 400 });
    }

    const formSchema = await generateRegistrationForm(eventDescription);

    return NextResponse.json({ formSchema });
  } catch (error) {
    console.error("Form generation error:", error);
    return NextResponse.json({ error: "Failed to generate form" }, { status: 500 });
  }
}
