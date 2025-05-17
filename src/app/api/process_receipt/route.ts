import { createUserContent, GoogleGenAI, Part } from "@google/genai";

const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const ai = new GoogleGenAI({ apiKey: geminiKey });

const imagePrompt = `
This is a receipt. Please extract the details from the receipt into JSON format.
Use the following structure:
Receipt(ReceiptID, PurchaseStore, PurchaseDate, PurchaseAddress, TotalAmount)
Items(ItemID, ReceiptID, ItemName, ItemPrice)
Format:
- ReceiptID: Use PurchaseDate to generate an ID with year, month, day, hour, and minute, no separators.
- ItemID: Use ReceiptID and a sequential number.
- If any information is unclear, use 'N/A'.
`;

async function parseForm(req: Request): Promise<{ buffer: Buffer; mimeType: string }> {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file || typeof file === "string") {
    throw new Error("Image not found or invalid");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return { buffer, mimeType: file.type };
}

function parseReceiptJSON(receiptStr: string) {
  try {
    const jsonMatch = receiptStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    const lines = receiptStr.trim().split("\n");
    const jsonStr = lines.slice(1, -1).join("\n");
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error("JSON parse error:", err);
    return null;
  }
}

function extractReceiptData(jsonObj: any) {
  let receipt = null;
  let items: any[] = [];
  if (jsonObj) {
    receipt = Array.isArray(jsonObj.Receipt) ? jsonObj.Receipt[0] : jsonObj.Receipt;
    items = jsonObj.Items ?? [];
  }
  return { receipt, items };
}

export async function POST(req: Request) {
  try {
    const { buffer, mimeType } = await parseForm(req);

    const imagePart: Part = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const resse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [createUserContent([imagePrompt, imagePart])],
    });

    const text = resse.text

    if (!text) {
      return new Response("No text returned", { status: 500 });
    }

    console.log("Gemini response:", text);

    const receiptJSON = parseReceiptJSON(text);
    const { receipt, items } = extractReceiptData(receiptJSON);

    return Response.json({ receipt, items });
  } catch (err: any) {
    console.error("Handler error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
    });
  }
}
