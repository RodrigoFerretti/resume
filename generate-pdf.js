const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF(language) {
  const htmlFile = `${language}.html`;
  const pdfFile = `${language}.pdf`;
  const htmlPath = path.join(__dirname, htmlFile);

  // Check if HTML file exists
  if (!fs.existsSync(htmlPath)) {
    console.error(`Error: ${htmlFile} not found`);
    process.exit(1);
  }

  console.log(`Generating PDF from ${htmlFile}...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Load the HTML file
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF with A4 format
    await page.pdf({
      path: pdfFile,
      format: 'A4',
      printBackground: true,
      // scale: 0.75,
      // margin: {
      //   top: '0.1cm',
      //   right: '0.1cm',
      //   bottom: '0.1cm',
      //   left: '0.1cm'
      // }
    });

    console.log(`✓ PDF generated successfully: ${pdfFile}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Get language from command line argument
const language = process.argv[2];

if (!language) {
  console.error('Please specify a language: pt-br or en-us');
  console.error('Usage: node generate-pdf.js <language>');
  process.exit(1);
}

if (language !== 'pt-br' && language !== 'en-us') {
  console.error('Invalid language. Use pt-br or en-us');
  process.exit(1);
}

generatePDF(language);
