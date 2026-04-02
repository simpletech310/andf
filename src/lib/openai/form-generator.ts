import { openai } from "./client";
import { z } from "zod";

const FormFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(["text", "email", "phone", "number", "select", "checkbox", "textarea", "date"]),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

const FormSchemaSchema = z.object({
  fields: z.array(FormFieldSchema),
});

export type FormField = z.infer<typeof FormFieldSchema>;
export type FormSchema = z.infer<typeof FormSchemaSchema>;

const SYSTEM_PROMPT = `You are a registration form generator for A New Day Foundation, a nonprofit that runs youth programs (Band Camp, Drone Experience, TopGolf, Mentorship, HBCU Heroes).

When given a description of an event, generate a JSON registration form schema. Always include these baseline fields:
1. participant_name (text, required)
2. participant_email (email, required)
3. participant_phone (phone, required)
4. participant_age (number, required)
5. parent_guardian_name (text, required)
6. emergency_contact (text, required)

Then add event-specific fields based on the description. Output ONLY valid JSON matching this structure:
{
  "fields": [
    {
      "name": "field_name",
      "label": "Display Label",
      "type": "text|email|phone|number|select|checkbox|textarea|date",
      "required": true|false,
      "placeholder": "optional placeholder text",
      "options": ["only for select type"],
      "min": null,
      "max": null
    }
  ]
}`;

export async function generateRegistrationForm(eventDescription: string): Promise<FormSchema> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Generate a registration form for this event: ${eventDescription}` },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No response from AI");

  const parsed = JSON.parse(content);
  return FormSchemaSchema.parse(parsed);
}
