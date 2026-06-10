const express = require('express');
const { chromium } = require('playwright');
const app = express();

app.use(express.json({ limit: '15mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.get('/', (req, res) => res.send('OK'));

app.post('/pdf', async (req, res) => {
  const { html, filename } = req.body;
  if (!html) return res.status(400).json({ error: 'html required' });
  let browser;
  try {
    browser = await chromium.launch({
      args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top:'0', bottom:'0', left:'0', right:'0' }
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename||'job_card.pdf'}"`);
    res.send(Buffer.from(pdf));
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Running on ${PORT}`));
