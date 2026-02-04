import { readFileSync } from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

async function extractText() {
  const data = new Uint8Array(readFileSync('./samples/eagleview.pdf'));
  const doc = await getDocument({ data }).promise;

  console.log('Total pages:', doc.numPages);
  console.log('---');

  // Extract text from all pages
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map(item => item.str).join(' ');
    console.log('=== PAGE', i, '===');
    console.log(text);
    console.log('\n');
  }
}

extractText().catch(console.error);
