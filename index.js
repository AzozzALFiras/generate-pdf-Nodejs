// Developer : Azozz ALFiras
// github : https://github.com/AzozzALFiras/generate-pdf-Nodejs/

const express = require('express'); // Importing Express.js framework
const puppeteer = require('puppeteer'); // Importing Puppeteer for PDF generation
const fs = require('fs'); // Importing Node.js File System module

const app = express(); // Creating an Express application
const port = 3000; // Setting the port number (change as needed)

async function generatePDF(url, outputPath) {
  // Function to generate PDF from a given URL
  const browser = await puppeteer.launch(); // Launching a headless browser instance
  const page = await browser.newPage(); // Opening a new page in the browser
  await page.goto(url); // Navigating the page to the given URL
  await page.pdf({ path: outputPath, format: 'A4' }); // Generating PDF from the page
  await browser.close(); // Closing the browser instance
}

app.get('/generate-pdf', async (req, res) => {
  // Handling GET request to generate PDF
  const url = req.query.url; // Getting URL from query parameters
  const outputPath = req.query.outputPath || 'output.pdf'; // Setting output path for PDF

  const filename = new URL(url).pathname.split('/').pop(); // Extracting filename from URL
  
  try {
    await generatePDF(url, `pdf/${outputPath}_${filename}.pdf`); // Generating PDF with provided URL
    res.send({ path: `http://localhost:${port}/pdf/${outputPath}_${filename}.pdf`, message: 'PDF generated successfully' }); // Sending response with PDF path
  } catch (error) {
    res.status(500).send({ error: 'Error generating PDF' }); // Handling error while generating PDF
  }
});

app.get('/pdf/:filename', (req, res) => {
  // Handling GET request to serve PDF file
  const filename = req.params.filename; // Getting filename from URL parameter
  const filePath = `${__dirname}/pdf/${filename}`; // Constructing file path
  res.sendFile(filePath); // Sending the PDF file as response
});

app.listen(port, () => {
  // Starting the Express server
  console.log(`PDF generator app listening at http://localhost:${port}`); // Logging server start message
});
