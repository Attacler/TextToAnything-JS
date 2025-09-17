export class TextToAnything {
    APIToken = "";
    constructor(APIToken) {
        this.APIToken = APIToken;
    }
    async generatePDF(fileName, PDFData) {
        if (PDFData.landscape == undefined)
            PDFData.landscape = false;
        return await this.downloadFile(fileName, "generatePDF", PDFData, "POST");
    }
    async generatePDFFromTemplate(fileName, templateID, templateData) {
        return await this.downloadFile(fileName, "generatePDF/template", {
            templateID,
            templateData,
        }, "POST");
    }
    async generateBarcode(fileName, BarcodeData) {
        return await this.downloadFile(fileName, "generateBarcode", BarcodeData, "GET");
    }
    async generateQRCode(fileName, QRcodeData) {
        return await this.downloadFile(fileName, "generateQR", QRcodeData, "GET");
    }
    async OCR(file, language, mimeType, mode) {
        const url = "https://text-to-anything.p.rapidapi.com/ocr";
        const formdata = new FormData();
        formdata.append("image", file instanceof Uint8Array
            ? new Blob([file], {
                type: mimeType,
            })
            : file, mimeType);
        return await fetch(url + "?language=" + language + "&mode=" + mode, {
            method: "POST",
            body: formdata,
            headers: {
                "X-RapidAPI-Key": this.APIToken,
            },
        }).then((e) => e.text());
    }
    async downloadFile(fileName, path, data, method) {
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
        })
            .then(async (response) => {
            if (response.status != 200) {
                const error = await response.text();
                throw new Error("[TTA] Could not download file, error: " + error);
            }
            return response.blob();
        })
            .then((blob) => new File([blob], fileName, {
            type: blob.type,
            lastModified: Date.now(),
        }));
    }
}
export class TextToAnythingVirusScanner {
    APIToken = "";
    constructor(APIToken) {
        this.APIToken = APIToken;
    }
    async scanFile(file, mimeType) {
        const url = "https://virusscan-texttoanything.p.rapidapi.com/virusScan";
        const formdata = new FormData();
        formdata.append("file", file instanceof Uint8Array
            ? new Blob([file], {
                type: mimeType,
            })
            : file, mimeType);
        return await fetch(url, {
            method: "POST",
            body: formdata,
            headers: {
                "X-RapidAPI-Key": this.APIToken,
            },
        }).then((e) => e.json());
    }
}
//# sourceMappingURL=main.js.map