const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();
const port = 3000; // Change port number as needed

async function generatePDF(url, outputPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.pdf({ path: outputPath, format: 'A4' });
  await browser.close();
}

app.get('/generate-pdf', async (req, res) => {
  const url = req.query.url;
  const outputPath = req.query.outputPath || 'output.pdf';
  
  const filename = new URL(url).pathname.split('/').pop(); // Extract filename from URL
  
  try {
    await generatePDF(url, `pdf/${outputPath}_${filename}.pdf`); // Append filename to output path
    res.send({ path: `http://localhost:${port}/pdf/${outputPath}_${filename}.pdf`, message: 'PDF generated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error generating PDF' });
  }
});

app.get('/pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `${__dirname}/pdf/${filename}`;
  res.sendFile(filePath);

});

app.listen(port, () => {
  console.log(`PDF generator app listening at http://localhost:${port}`);
});
