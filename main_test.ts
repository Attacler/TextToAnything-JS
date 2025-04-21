import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { TextToAnything } from "./main.ts";

const getAPIToken = Deno.env.get("RAPID_API_TOKEN");

const TTA = new TextToAnything(getAPIToken);

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
