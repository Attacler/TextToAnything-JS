import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "jsr:@std/assert";
import { TextToAnything } from "./main.ts";

const getAPIToken = Deno.env.get("RAPID_API_TOKEN");

const TTA = new TextToAnything(getAPIToken as string);

Deno.test(async function PDFTest() {
  const PDF = await TTA.generatePDF("test.pdf", {
    html: "Hello world!",
    format: "A4",
  });

  await Deno.writeFile(
    "tests-files/test.pdf",
    new Uint8Array(await PDF.arrayBuffer())
  );
});

Deno.test(async function PDFTemplateTest() {
  const PDF = await TTA.generatePDFFromTemplate("templateTest.pdf", 10, {
    company_name: "Your Company Name",
    company_address: "456 Business Ave, Suite 100, Business City, BC 12345",
    company_email: "contact@yourcompany.com",
    company_phone: "(555) 123-4567",
    client_name: "John Doe",
    client_address: "123 Main Street, New York, NY 10001",
    client_email: "john.doe@email.com",
    invoice_number: "INV-2024-001",
    invoice_date: "2024-06-12",
    due_date: "2024-07-12",
    line_items: [
      {
        description: "Professional Web Development",
        quantity: "40",
        rate: "$25.00",
        amount: "$1,000.00",
      },
      {
        description: "Website Hosting Setup",
        quantity: "1",
        rate: "$150.00",
        amount: "$150.00",
      },
      {
        description: "Domain Registration",
        quantity: "1",
        rate: "$15.00",
        amount: "$15.00",
      },
    ],
    subtotal: "$1,165.00",
    tax_amount: "$104.85",
    total_amount: "$1,269.85",
    payment_terms: "Payment due within 30 days",
  });

  await Deno.writeFile(
    "tests-files/testTemplate.pdf",
    new Uint8Array(await PDF.arrayBuffer())
  );
});

Deno.test(async function BarcodeTest() {
  const barcode = await TTA.generateBarcode("barcode.png", {
    content: "Test-12345",
    type: "code128",
    includeText: true,
  });

  await Deno.writeFile(
    "tests-files/barcode.png",
    new Uint8Array(await barcode.arrayBuffer())
  );
});

Deno.test(async function QRcodeTest() {
  const qrcode = await TTA.generateQRCode("qrcode.png", {
    content: "https://rapidapi.com/Attacler/api/text-to-anything",
  });

  await Deno.writeFile(
    "tests-files/qrcode.png",
    new Uint8Array(await qrcode.arrayBuffer())
  );
});

Deno.test(async function OCRTest() {
  const file = Deno.readFileSync("tests-files/shakespear.jpg");
  const ocr = await TTA.OCR(file, "eng", "image/jpeg", "text");

  assertEquals(
    ocr,
    `“We know what
we are, but not
what we may be.”

Shakespeare
`
  );
});
