type TTA_pdf = {
  html: string;
  format:
    | "A1"
    | "A2"
    | "A3"
    | "A4"
    | "A5"
    | "A6"
    | "Letter"
    | "Legal"
    | "Tabloid"
    | "Ledger";
  landscape?: boolean;
  margin?: number;
  marginLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  footer?: string;
  header?: string;
};

type TTA_barcode = {
  content: string;
  type:
    | "auspost"
    | "azteccode"
    | "azteccodecompact"
    | "aztecrune"
    | "bc412"
    | "channelcode"
    | "codablockf"
    | "code11"
    | "code128"
    | "code16k"
    | "code2of5"
    | "code32"
    | "code39"
    | "code39ext"
    | "code49"
    | "code93"
    | "code93ext"
    | "codeone"
    | "coop2of5"
    | "daft"
    | "databarexpanded"
    | "databarexpandedcomposite"
    | "databarexpandedstacked"
    | "databarexpandedstackedcomposite"
    | "databarlimited"
    | "databarlimitedcomposite"
    | "databaromni"
    | "databaromnicomposite"
    | "databarstacked"
    | "databarstackedcomposite"
    | "databarstackedomni"
    | "databarstackedomnicomposite"
    | "databartruncated"
    | "databartruncatedcomposite"
    | "datalogic2of5"
    | "datamatrix"
    | "datamatrixrectangular"
    | "datamatrixrectangularextension"
    | "dotcode"
    | "ean13"
    | "ean13composite"
    | "ean14"
    | "ean2"
    | "ean5"
    | "ean8"
    | "ean8composite"
    | "flattermarken"
    | "gs1-128"
    | "gs1-128composite"
    | "gs1-cc"
    | "gs1datamatrix"
    | "gs1datamatrixrectangular"
    | "gs1dldatamatrix"
    | "gs1dlqrcode"
    | "gs1dotcode"
    | "gs1northamericancoupon"
    | "gs1qrcode"
    | "hanxin"
    | "hibcazteccode"
    | "hibccodablockf"
    | "hibccode128"
    | "hibccode39"
    | "hibcdatamatrix"
    | "hibcdatamatrixrectangular"
    | "hibcmicropdf417"
    | "hibcpdf417"
    | "hibcqrcode"
    | "iata2of5"
    | "identcode"
    | "industrial2of5"
    | "interleaved2of5"
    | "isbn"
    | "ismn"
    | "issn"
    | "itf14"
    | "japanpost"
    | "kix"
    | "leitcode"
    | "mailmark"
    | "mands"
    | "matrix2of5"
    | "maxicode"
    | "micropdf417"
    | "microqrcode"
    | "msi"
    | "onecode"
    | "pdf417"
    | "pdf417compact"
    | "pharmacode"
    | "pharmacode2"
    | "planet"
    | "plessey"
    | "posicode"
    | "postnet"
    | "pzn"
    | "qrcode"
    | "rationalizedCodabar"
    | "raw"
    | "rectangularmicroqrcode"
    | "royalmail"
    | "sscc18"
    | "swissqrcode"
    | "symbol"
    | "telepen"
    | "telepennumeric"
    | "ultracode"
    | "upca"
    | "upcacomposite"
    | "upce"
    | "upcecomposite";
  scale?: number;
  height?: number;
  includeText?: boolean;
};

type TTA_QRcode = {
  content: string;
  darkColor?: string;
  lightColor?: string;
  margin?: number;
  width?: number;
};

export class TextToAnything {
  private APIToken = "";

  constructor(APIToken: string) {
    this.APIToken = APIToken;
  }

  async generatePDF(fileName: string, PDFData: TTA_pdf): Promise<File> {
    if (PDFData.landscape == undefined) PDFData.landscape = false;

    return await this.downloadFile(fileName, "generatePDF", PDFData, "POST");
  }

  async generatePDFFromTemplate(
    fileName: string,
    templateID: number,
    templateData: any
  ): Promise<File> {
    return await this.downloadFile(
      fileName,
      "generatePDF/template",
      {
        templateID,
        templateData,
      },
      "POST"
    );
  }

  async generateBarcode(
    fileName: string,
    BarcodeData: TTA_barcode
  ): Promise<File> {
    return await this.downloadFile(
      fileName,
      "generateBarcode",
      BarcodeData,
      "GET"
    );
  }

  async generateQRCode(
    fileName: string,
    QRcodeData: TTA_QRcode
  ): Promise<File> {
    return await this.downloadFile(fileName, "generateQR", QRcodeData, "GET");
  }

  async OCR(
    file: File | Uint8Array,
    language: string,
    mimeType: string,
    mode: "text" | "horc"
  ): Promise<string> {
    const url = "https://text-to-anything.p.rapidapi.com/ocr";

    const formdata = new FormData();
    formdata.append(
      "image",
      file instanceof Uint8Array
        ? new Blob([file as any], {
            type: mimeType,
          })
        : file,
      mimeType
    );

    return await fetch(url + "?language=" + language + "&mode=" + mode, {
      method: "POST",
      body: formdata,
      headers: {
        "X-RapidAPI-Key": this.APIToken,
      },
    }).then((e) => e.text());
  }

  private async downloadFile(
    fileName: string,
    path: string,
    data: any,
    method: "POST" | "GET"
  ) {
    let url = "https://text-to-anything.p.rapidapi.com/" + path;

    if (method == "GET") {
      const query = new URLSearchParams(data).toString();
      url += "?" + query;
    }

    return await fetch(url, {
      method: method,
      body: method == "POST" ? JSON.stringify(data) : undefined,
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": this.APIToken,
      },
    } as any)
      .then(async (response) => {
        if (response.status != 200) {
          const error = await response.text();
          throw new Error("[TTA] Could not download file, error: " + error);
        }

        return response.blob();
      })
      .then(
        (blob) =>
          new File([blob], fileName, {
            type: blob.type,
            lastModified: Date.now(),
          })
      );
  }
}

export class TextToAnythingVirusScanner {
  private APIToken = "";

  constructor(APIToken: string) {
    this.APIToken = APIToken;
  }

  async scanFile(
    file: File | Uint8Array,
    mimeType: string
  ): Promise<{
    isInfected: boolean;
    viruses: string[];
    timeout: boolean;
  }> {
    const url = "https://virusscan-texttoanything.p.rapidapi.com/virusScan";

    const formdata = new FormData();
    formdata.append(
      "file",
      file instanceof Uint8Array
        ? new Blob([file as any], {
            type: mimeType,
          })
        : file,
      mimeType
    );

    return await fetch(url, {
      method: "POST",
      body: formdata,
      headers: {
        "X-RapidAPI-Key": this.APIToken,
      },
    }).then((e) => e.json());
  }
}
