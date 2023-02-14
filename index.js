const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    modifyPdf();
    res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


const fs = require('fs');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function modifyPdf() {


    const name = "Manuel"
    const surname = "Szecsenyi"; // Lorem ipsum dolor sit amet consectetur adipisicing elit"
    const email = "manuel.szecsenyi@one2print.at";
    const phone = "0664 1234567";
    const title = "CEO One2Print";

    let textWidth, textHeight, fontSize, lineBuffer;


    // This should be a Uint8Array or ArrayBuffer
    // This data can be obtained in a number of different ways
    // If your running in a Node environment, you could use fs.readFile()
    // In the browser, you could make a fetch() call and use res.arrayBuffer()
    const existingPdfBytes = fs.readFileSync('./document.pdf');

    // Load a PDFDocument from the existing PDF bytes
    const pdfDoc = await PDFDocument.load(existingPdfBytes)

    // Embed the Helvetica font
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

    // Get the first page of the document
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize()

    lineBuffer = 100

    // Draw name
    const fullName = name + " " + surname;
    fontSize = 10
    textWidth = helveticaFont.widthOfTextAtSize(fullName, fontSize);

    console.log(textWidth);

    if(textWidth > 200) {
        fontSize = calculateFontSize(fullName, helveticaFont, 200);
        textWidth = helveticaFont.widthOfTextAtSize(fullName, fontSize);
    }

    firstPage.drawText(fullName, {
        x: width - textWidth - 40,
        y: lineBuffer,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        maxWidth: 200,
        lineHeight: 10,
    })

    // Draw title
    if(title != "") {
        textWidth = helveticaFont.widthOfTextAtSize(title, 7);
        textHeight = helveticaFont.heightAtSize(7);
        lineBuffer -= textHeight + 5;
        firstPage.drawText(title, {
            x: width - textWidth - 40,
            y: lineBuffer,
            size: 7,
            font: helveticaFont,
            color: rgb(0.4, 0.4, 0.4),
        })
    }

    // Padding between section
    lineBuffer -= 5;

    // Draw telephone
    if(phone != "") {
        textWidth = helveticaFont.widthOfTextAtSize(phone, 7);
        textHeight = helveticaFont.heightAtSize(7);
        lineBuffer -= textHeight + 5;
        firstPage.drawText(phone, {
            x: width - textWidth - 40,
            y: lineBuffer,
            size: 7,
            font: helveticaFont,
            color: rgb(0,0,0),
        })
    }

    // Draw email
    if(email != "") {
        textWidth = helveticaFont.widthOfTextAtSize(email, 7);
        textHeight = helveticaFont.heightAtSize(7);
        lineBuffer -= textHeight + 5;
        firstPage.drawText(email, {
            x: width - textWidth - 40,
            y: lineBuffer,
            size: 7,
            font: helveticaFont,
            color: rgb(0,0,0),
        })
    }

    lineBuffer -= 5;

    firstPage.drawLine({
        start: { x: 40, y: lineBuffer - 5 },
        end: { x: width - 40, y: lineBuffer - 5 },
    })

    lineBuffer -= 5;

    
    



    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    fs.writeFileSync('./document-modified.pdf', pdfBytes)

    // For example, `pdfBytes` can be:
    //   • Written to a file in Node
    //   • Downloaded from the browser
    //   • Rendered in an <iframe>
};

function calculateFontSize(text, font, width) {
    let fontSize = 1;
    while (font.widthOfTextAtSize(text, fontSize) < width) {
        fontSize += 1;
    }
    return fontSize - 1;
}