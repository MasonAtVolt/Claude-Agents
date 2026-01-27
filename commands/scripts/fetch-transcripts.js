const https = require('https');
const fs = require('fs');
const path = require('path');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_VERSION = '2022-06-28';

const transcripts = [
  { id: '2f03acdc-7e9b-81f8-8aed-eaf647571a09', name: 'AP Pain Points', date: '2026-01-22' },
  { id: '2f03acdc-7e9b-8173-bcd0-c2a98f295d59', name: 'Planning', date: '2026-01-22' },
  { id: '2ef3acdc-7e9b-81ba-829e-fb25bcd17cc4', name: 'B2B Order to Cash', date: '2026-01-21' },
  { id: '2ef3acdc-7e9b-817b-82e8-cde1a55851fa', name: 'B2C Order to Cash', date: '2026-01-21' },
  { id: '2ef3acdc-7e9b-812a-98b8-ceea77861fe3', name: 'Accounts Payable', date: '2026-01-21' },
  { id: '2ee3acdc-7e9b-812e-b3ca-ce3dd6c0feb4', name: 'Warehouse Movements', date: '2026-01-20' },
  { id: '2ee3acdc-7e9b-815a-8ecc-d41d7954badb', name: 'Tax Management', date: '2026-01-20' }
];

function notionRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.notion.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function fetchAllBlocks(pageId) {
  let allBlocks = [];
  let cursor = null;
  let hasMore = true;

  while (hasMore) {
    const url = `/v1/blocks/${pageId}/children?page_size=100${cursor ? `&start_cursor=${cursor}` : ''}`;
    const data = await notionRequest(url);

    if (data.results) {
      allBlocks = allBlocks.concat(data.results);
    }

    hasMore = data.has_more || false;
    cursor = data.next_cursor;
  }

  return allBlocks;
}

async function fetchPageProperties(pageId) {
  const data = await notionRequest(`/v1/pages/${pageId}`);
  return data.properties || {};
}

function extractText(richText) {
  if (!richText || !Array.isArray(richText)) return '';
  return richText.map(t => t.plain_text || '').join('');
}

function blocksToMarkdown(blocks) {
  let markdown = '';

  for (const block of blocks) {
    const type = block.type;
    const content = block[type];

    switch (type) {
      case 'heading_1':
        markdown += `# ${extractText(content?.rich_text)}\n\n`;
        break;
      case 'heading_2':
        markdown += `## ${extractText(content?.rich_text)}\n\n`;
        break;
      case 'heading_3':
        markdown += `### ${extractText(content?.rich_text)}\n\n`;
        break;
      case 'paragraph':
        const text = extractText(content?.rich_text);
        if (text) markdown += `${text}\n\n`;
        break;
      case 'bulleted_list_item':
        markdown += `- ${extractText(content?.rich_text)}\n`;
        break;
      case 'numbered_list_item':
        markdown += `1. ${extractText(content?.rich_text)}\n`;
        break;
      case 'quote':
        markdown += `> ${extractText(content?.rich_text)}\n\n`;
        break;
      case 'code':
        markdown += `\`\`\`${content?.language || ''}\n${extractText(content?.rich_text)}\n\`\`\`\n\n`;
        break;
      case 'divider':
        markdown += `---\n\n`;
        break;
      case 'toggle':
        markdown += `**${extractText(content?.rich_text)}**\n\n`;
        break;
      case 'callout':
        markdown += `> **Note:** ${extractText(content?.rich_text)}\n\n`;
        break;
      default:
        // Handle other types by extracting rich_text if available
        if (content?.rich_text) {
          const text = extractText(content.rich_text);
          if (text) markdown += `${text}\n\n`;
        }
    }
  }

  return markdown;
}

async function processTranscript(transcript) {
  console.log(`Processing: ${transcript.name}...`);

  // Fetch properties
  const properties = await fetchPageProperties(transcript.id);
  const attendees = properties.Attendees?.multi_select?.map(a => a.name) || [];
  const title = properties.Title?.title?.[0]?.plain_text || transcript.name;
  const date = properties.Date?.date?.start || transcript.date;

  // Fetch all blocks
  const blocks = await fetchAllBlocks(transcript.id);
  console.log(`  Fetched ${blocks.length} blocks`);

  // Convert to markdown
  const content = blocksToMarkdown(blocks);

  // Build the full markdown document
  let markdown = `# White & Warren SP1 Shadowing - ${transcript.name}

## Meeting Information

- **Project:** White & Warren Business Central Implementation
- **Sprint:** Sprint 1
- **Session:** ${transcript.name}
- **Date:** ${date}
- **Attendees:** ${attendees.join(', ') || 'See transcript'}

---

## Transcript

${content}
`;

  return markdown;
}

async function main() {
  const inputDir = path.join(__dirname, 'input');

  // Ensure input directory exists
  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
  }

  for (const transcript of transcripts) {
    try {
      const markdown = await processTranscript(transcript);

      // Create filename
      const filename = `white-warren-sp1-${transcript.name.toLowerCase().replace(/\s+/g, '-')}-${transcript.date}.md`;
      const filepath = path.join(inputDir, filename);

      // Write to file
      fs.writeFileSync(filepath, markdown, 'utf8');
      console.log(`  Saved: ${filename}`);
    } catch (error) {
      console.error(`  Error processing ${transcript.name}:`, error.message);
    }
  }

  console.log('\nAll transcripts saved to input/ folder');
}

main().catch(console.error);
