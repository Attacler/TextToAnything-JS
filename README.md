# TextToAnything-deno

This package is a wrapper around the TextToAnything API without using any external dependencies. <br>
It allows you to easily generate PDF`s, QRCodes or barcodes. This package will return a File object which you can use however you like. <br>
You can join our Discord incase you need support: [Discord](https://discord.gg/dbEWUHGmnr) <br>
Compatible with Deno Deploy.

## Requirements

- A RapidAPI token [you can get it here](https://rapidapi.com/Attacler/api/text-to-anything)

## Usage

1. Add the TTA package:

```
deno add jsr:@texttoanything/deno
```

2. Initialize TTA:

```ts
import { TextToAnything } from "@texttoanything/deno";

const TTA = new TextToAnything(/*API token here*/);
```

Your done setting up!

Generating a PDF:

```ts
const PDF = await TTA.generatePDF("test.pdf", {
  header: "Header HTML", // optional
  html: "<h1>Hello world!</h1>",
  footer: "Footer HTML", // optional
  landscape: false, // false -> portrait, true -> landscape mode (default)
  format: "A4",
});
```

Generating a Barcode:

```ts
const barcode = await TTA.generateBarcode("barcode.png", {
  content: "Test-12345",
  type: "code128",
  includeText: true,
});
```

Generating a QRCode:

```ts
const qrcode = await TTA.generateQRCode("qrcode.png", {
  content: "https://rapidapi.com/Attacler/api/text-to-anything",
});
```

Using OCR on a file:

```ts
const ocrText = await TTA.OCR(file, "eng", "image/jpeg", "text");
```
