/**
 * HTML to PowerPoint Converter
 *
 * Converts HTML slideshow presentations to PowerPoint (.pptx) format
 * while preserving Volt Technologies branding.
 *
 * Usage: node convert-html-to-pptx.js <input.html> [output.pptx]
 *
 * Dependencies: npm install pptxgenjs cheerio
 */

const fs = require('fs');
const path = require('path');
const PptxGenJS = require('pptxgenjs');
const cheerio = require('cheerio');

// Volt Technologies Brand Colors
const BRAND = {
  colors: {
    primary: '000000',      // Black
    secondary: 'FFFFFF',    // White
    accent: 'D4AF37',       // Gold
    accentLight: 'F5D547',  // Light Gold
    textMuted: '555555',    // Muted text
    tableBorder: 'E0E0E0',  // Table border
    tableAlt: 'F9F9F9',     // Alternating row
    statusOpen: 'FED7D7',   // Red background
    statusClosed: 'C6F6D5', // Green background
    priorityHigh: 'C53030', // Red text
    priorityMed: 'D69E2E',  // Yellow text
    priorityLow: '38A169',  // Green text
  },
  fonts: {
    heading: 'Montserrat',
    body: 'Fira Sans',
  },
  logoPath: {
    full: 'assets/logos/black-VOLT-TECHNOLOGIES2 (L).png',
    mark: 'assets/logos/white-VOLT-TECHNOLOGIES3(S).png',
  }
};

// Slide dimensions (16:9)
const SLIDE_WIDTH = 13.333;
const SLIDE_HEIGHT = 7.5;

/**
 * Parse HTML file and extract slide data
 */
function parseHTML(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const slides = [];

  // Extract presentation title from <title> tag
  const pageTitle = $('title').text() || 'Presentation';

  // Parse each slide section
  $('section.slide, .slide').each((index, element) => {
    const $slide = $(element);
    const slideData = {
      index: index + 1,
      title: $slide.attr('data-title') || `Slide ${index + 1}`,
      type: getSlideType($slide),
      content: {}
    };

    // Extract content based on slide type
    switch (slideData.type) {
      case 'title':
        slideData.content = extractTitleSlide($slide);
        break;
      case 'section':
        slideData.content = extractSectionSlide($slide);
        break;
      case 'content':
        slideData.content = extractContentSlide($slide);
        break;
      case 'thankYou':
        slideData.content = extractThankYouSlide($slide);
        break;
      default:
        slideData.content = extractContentSlide($slide);
    }

    slides.push(slideData);
  });

  return { title: pageTitle, slides };
}

/**
 * Determine slide type from classes
 */
function getSlideType($slide) {
  const classes = $slide.attr('class') || '';

  if (classes.includes('title-slide')) return 'title';
  if (classes.includes('section-divider')) return 'section';
  if (classes.includes('thank-you-slide')) return 'thankYou';
  if (classes.includes('content-slide')) return 'content';
  if (classes.includes('question-slide')) return 'question';

  return 'content';
}

/**
 * Extract title slide content
 */
function extractTitleSlide($slide) {
  return {
    mainTitle: $slide.find('h1').first().text().trim(),
    subtitle: $slide.find('h2').first().text().trim(),
    sprintInfo: $slide.find('.sprint-info').text().trim(),
    date: $slide.find('.date').text().trim(),
    clientName: $slide.find('.client-name').text().trim(),
  };
}

/**
 * Extract section divider content
 */
function extractSectionSlide($slide) {
  return {
    title: $slide.find('h2').first().text().trim(),
    subtitle: $slide.find('.subtitle').text().trim(),
    agendaItems: $slide.find('.agenda-list li').map((i, el) =>
      cheerio.load(el).text().trim()
    ).get(),
  };
}

/**
 * Extract content slide content
 */
function extractContentSlide($slide) {
  const $ = cheerio.load($slide.html());

  // Extract table if present
  let tableData = null;
  const $table = $slide.find('table.data-table');
  if ($table.length) {
    tableData = extractTable($table);
  }

  // Extract talking points for question slides
  const talkingPoints = $slide.find('.talking-points li').map((i, el) =>
    cheerio.load(el).text().trim()
  ).get();

  return {
    title: $slide.find('h2').first().text().trim(),
    subtitle: $slide.find('.slide-subtitle, .question-category').text().trim(),
    description: $slide.find('> p').first().text().trim(),
    questionText: $slide.find('.question-text').text().trim(),
    questionNumber: $slide.find('.question-number').text().trim(),
    processContext: $slide.find('.process-context').text().trim(),
    table: tableData,
    talkingPoints: talkingPoints,
  };
}

/**
 * Extract table data
 */
function extractTable($table) {
  const headers = [];
  const rows = [];

  $table.find('thead th').each((i, el) => {
    headers.push(cheerio.load(el).text().trim());
  });

  $table.find('tbody tr').each((i, tr) => {
    const row = [];
    cheerio.load(tr)('td').each((j, td) => {
      row.push(cheerio.load(td).text().trim());
    });
    rows.push(row);
  });

  return { headers, rows };
}

/**
 * Extract thank you slide content
 */
function extractThankYouSlide($slide) {
  return {
    title: $slide.find('h2').first().text().trim() || 'Thank You!',
    contact: $slide.find('.contact').text().trim(),
  };
}

/**
 * Create PowerPoint presentation from parsed data
 */
function createPowerPoint(data, outputPath) {
  const pptx = new PptxGenJS();

  // Set presentation properties
  pptx.title = data.title;
  pptx.author = 'Volt Technologies';
  pptx.company = 'Volt Technologies';
  pptx.layout = 'LAYOUT_16x9';

  // Define master slides
  defineMasterSlides(pptx);

  // Create slides
  data.slides.forEach((slideData, index) => {
    createSlide(pptx, slideData, index, data.slides.length);
  });

  // Save the presentation
  return pptx.writeFile({ fileName: outputPath })
    .then(() => {
      console.log(`PowerPoint created: ${outputPath}`);
      return outputPath;
    });
}

/**
 * Define master slide layouts
 */
function defineMasterSlides(pptx) {
  // Dark master for title/section slides
  pptx.defineSlideMaster({
    title: 'DARK_MASTER',
    background: { color: BRAND.colors.primary },
  });

  // Light master for content slides
  pptx.defineSlideMaster({
    title: 'LIGHT_MASTER',
    background: { color: BRAND.colors.secondary },
  });
}

/**
 * Create a slide based on type
 */
function createSlide(pptx, slideData, index, totalSlides) {
  switch (slideData.type) {
    case 'title':
      createTitleSlide(pptx, slideData.content);
      break;
    case 'section':
      createSectionSlide(pptx, slideData.content);
      break;
    case 'question':
      createQuestionSlide(pptx, slideData.content, index, totalSlides);
      break;
    case 'thankYou':
      createThankYouSlide(pptx, slideData.content);
      break;
    default:
      createContentSlide(pptx, slideData.content, index, totalSlides);
  }
}

/**
 * Create title slide
 */
function createTitleSlide(pptx, content) {
  const slide = pptx.addSlide({ masterName: 'DARK_MASTER' });

  // Add logo if exists
  const logoPath = path.resolve(BRAND.logoPath.mark);
  if (fs.existsSync(logoPath)) {
    slide.addImage({
      path: logoPath,
      x: (SLIDE_WIDTH - 2.5) / 2,
      y: 0.5,
      w: 2.5,
      h: 0.8,
    });
  }

  // Main title
  if (content.mainTitle) {
    slide.addText(content.mainTitle.toUpperCase(), {
      x: 0.5,
      y: 2.0,
      w: SLIDE_WIDTH - 1,
      h: 1.2,
      fontSize: 44,
      fontFace: BRAND.fonts.heading,
      color: BRAND.colors.secondary,
      bold: true,
      align: 'center',
      valign: 'middle',
    });
  }

  // Subtitle
  if (content.subtitle) {
    slide.addText(content.subtitle, {
      x: 0.5,
      y: 3.2,
      w: SLIDE_WIDTH - 1,
      h: 0.6,
      fontSize: 24,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.secondary,
      align: 'center',
    });
  }

  // Sprint info
  if (content.sprintInfo) {
    slide.addText(content.sprintInfo.toUpperCase(), {
      x: 0.5,
      y: 4.0,
      w: SLIDE_WIDTH - 1,
      h: 0.5,
      fontSize: 18,
      fontFace: BRAND.fonts.heading,
      color: BRAND.colors.accent,
      align: 'center',
    });
  }

  // Date
  if (content.date) {
    slide.addText(content.date, {
      x: 0.5,
      y: 4.6,
      w: SLIDE_WIDTH - 1,
      h: 0.4,
      fontSize: 14,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.secondary,
      align: 'center',
    });
  }

  // Volt Technologies text
  slide.addText('VOLT TECHNOLOGIES', {
    x: 0.5,
    y: 6.5,
    w: SLIDE_WIDTH - 1,
    h: 0.4,
    fontSize: 12,
    fontFace: BRAND.fonts.heading,
    color: BRAND.colors.accent,
    align: 'center',
  });
}

/**
 * Create section divider slide
 */
function createSectionSlide(pptx, content) {
  const slide = pptx.addSlide({ masterName: 'DARK_MASTER' });

  // Section title
  slide.addText(content.title.toUpperCase(), {
    x: 0.5,
    y: 2.5,
    w: SLIDE_WIDTH - 1,
    h: 1.0,
    fontSize: 40,
    fontFace: BRAND.fonts.heading,
    color: BRAND.colors.secondary,
    bold: true,
    align: 'center',
  });

  // Subtitle
  if (content.subtitle) {
    slide.addText(content.subtitle.toUpperCase(), {
      x: 0.5,
      y: 3.6,
      w: SLIDE_WIDTH - 1,
      h: 0.5,
      fontSize: 16,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.accent,
      align: 'center',
    });
  }

  // Agenda items
  if (content.agendaItems && content.agendaItems.length > 0) {
    const agendaText = content.agendaItems.map(item => ({
      text: item,
      options: {
        bullet: { type: 'bullet', color: BRAND.colors.accent },
        fontSize: 20,
        fontFace: BRAND.fonts.body,
        color: BRAND.colors.secondary,
      }
    }));

    slide.addText(agendaText, {
      x: 2,
      y: 3.5,
      w: SLIDE_WIDTH - 4,
      h: 3,
      valign: 'top',
    });
  }
}

/**
 * Create content slide
 */
function createContentSlide(pptx, content, index, totalSlides) {
  const slide = pptx.addSlide({ masterName: 'LIGHT_MASTER' });

  // Top accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE_WIDTH,
    h: 0.1,
    fill: { color: BRAND.colors.accent },
  });

  // Title
  if (content.title) {
    slide.addText(content.title, {
      x: 0.75,
      y: 0.5,
      w: SLIDE_WIDTH - 1.5,
      h: 0.7,
      fontSize: 32,
      fontFace: BRAND.fonts.heading,
      color: BRAND.colors.primary,
      bold: true,
    });
  }

  // Subtitle
  if (content.subtitle) {
    slide.addText(content.subtitle, {
      x: 0.75,
      y: 1.1,
      w: SLIDE_WIDTH - 1.5,
      h: 0.4,
      fontSize: 14,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.accent,
    });
  }

  // Description
  if (content.description) {
    slide.addText(content.description, {
      x: 0.75,
      y: 1.5,
      w: SLIDE_WIDTH - 1.5,
      h: 0.4,
      fontSize: 14,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.textMuted,
    });
  }

  // Table
  if (content.table && content.table.headers.length > 0) {
    createTable(slide, content.table);
  }

  // Footer
  addSlideFooter(slide, index + 1, content.title);
}

/**
 * Create question slide (for shadowing presentations)
 */
function createQuestionSlide(pptx, content, index, totalSlides) {
  const slide = pptx.addSlide({ masterName: 'LIGHT_MASTER' });

  // Top accent bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: SLIDE_WIDTH,
    h: 0.1,
    fill: { color: BRAND.colors.accent },
  });

  // Process context
  if (content.processContext) {
    slide.addText(content.processContext.toUpperCase(), {
      x: 0.75,
      y: 0.4,
      w: 6,
      h: 0.4,
      fontSize: 12,
      fontFace: BRAND.fonts.heading,
      color: BRAND.colors.accent,
      bold: true,
    });
  }

  // Category badge
  if (content.subtitle) {
    slide.addText(content.subtitle, {
      x: SLIDE_WIDTH - 3,
      y: 0.4,
      w: 2.25,
      h: 0.35,
      fontSize: 10,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.secondary,
      fill: { color: BRAND.colors.primary },
      align: 'center',
      valign: 'middle',
    });
  }

  // Question number
  if (content.questionNumber) {
    slide.addText(content.questionNumber, {
      x: 0.75,
      y: 1.0,
      w: SLIDE_WIDTH - 1.5,
      h: 0.4,
      fontSize: 12,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.textMuted,
    });
  }

  // Main question text
  if (content.questionText || content.title) {
    slide.addText(content.questionText || content.title, {
      x: 0.75,
      y: 1.5,
      w: SLIDE_WIDTH - 1.5,
      h: 1.8,
      fontSize: 28,
      fontFace: BRAND.fonts.heading,
      color: BRAND.colors.primary,
      bold: true,
      valign: 'top',
    });
  }

  // Talking points
  if (content.talkingPoints && content.talkingPoints.length > 0) {
    // Discussion points header
    slide.addText('Discussion Points:', {
      x: 0.75,
      y: 3.8,
      w: SLIDE_WIDTH - 1.5,
      h: 0.4,
      fontSize: 12,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.textMuted,
      bold: true,
    });

    // Talking points box
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.75,
      y: 4.2,
      w: SLIDE_WIDTH - 1.5,
      h: 2.0,
      fill: { color: 'F8F8F8' },
      line: { color: BRAND.colors.accent, pt: 0, type: 'solid' },
    });

    // Gold left border
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.75,
      y: 4.2,
      w: 0.05,
      h: 2.0,
      fill: { color: BRAND.colors.accent },
    });

    const talkingPointsText = content.talkingPoints.map(point => ({
      text: `> ${point}`,
      options: {
        fontSize: 12,
        fontFace: BRAND.fonts.body,
        color: BRAND.colors.primary,
        breakLine: true,
      }
    }));

    slide.addText(talkingPointsText, {
      x: 1.0,
      y: 4.4,
      w: SLIDE_WIDTH - 2,
      h: 1.6,
      valign: 'top',
    });
  }

  // Footer
  addSlideFooter(slide, index + 1, 'SHADOWING');
}

/**
 * Create table on slide
 */
function createTable(slide, tableData) {
  const rows = [];

  // Header row
  const headerRow = tableData.headers.map(header => ({
    text: header.toUpperCase(),
    options: {
      fill: { color: BRAND.colors.primary },
      color: BRAND.colors.secondary,
      fontSize: 11,
      fontFace: BRAND.fonts.heading,
      bold: true,
      align: 'left',
      valign: 'middle',
    }
  }));
  rows.push(headerRow);

  // Data rows
  tableData.rows.forEach((row, rowIndex) => {
    const dataRow = row.map(cell => ({
      text: cell,
      options: {
        fill: { color: rowIndex % 2 === 0 ? BRAND.colors.secondary : BRAND.colors.tableAlt },
        color: BRAND.colors.primary,
        fontSize: 10,
        fontFace: BRAND.fonts.body,
        align: 'left',
        valign: 'middle',
      }
    }));
    rows.push(dataRow);
  });

  slide.addTable(rows, {
    x: 0.75,
    y: 2.0,
    w: SLIDE_WIDTH - 1.5,
    colW: Array(tableData.headers.length).fill((SLIDE_WIDTH - 1.5) / tableData.headers.length),
    border: { pt: 0.5, color: BRAND.colors.tableBorder },
    autoPage: true,
    autoPageRepeatHeader: true,
  });
}

/**
 * Create thank you slide
 */
function createThankYouSlide(pptx, content) {
  const slide = pptx.addSlide({ masterName: 'DARK_MASTER' });

  // Thank you text
  slide.addText(content.title || 'Thank You!', {
    x: 0.5,
    y: 2.5,
    w: SLIDE_WIDTH - 1,
    h: 1.5,
    fontSize: 60,
    fontFace: BRAND.fonts.heading,
    color: BRAND.colors.accent,
    bold: true,
    align: 'center',
  });

  // Contact info
  if (content.contact) {
    slide.addText(content.contact, {
      x: 0.5,
      y: 4.2,
      w: SLIDE_WIDTH - 1,
      h: 0.5,
      fontSize: 16,
      fontFace: BRAND.fonts.body,
      color: BRAND.colors.secondary,
      align: 'center',
    });
  }

  // Volt Technologies text
  slide.addText('VOLT TECHNOLOGIES', {
    x: 0.5,
    y: 5.5,
    w: SLIDE_WIDTH - 1,
    h: 0.4,
    fontSize: 14,
    fontFace: BRAND.fonts.heading,
    color: BRAND.colors.secondary,
    align: 'center',
  });
}

/**
 * Add footer to content slides
 */
function addSlideFooter(slide, slideNum, context) {
  // Gold line
  slide.addShape(PptxGenJS.ShapeType.rect, {
    x: 0.75,
    y: 6.8,
    w: SLIDE_WIDTH - 1.5,
    h: 0.03,
    fill: { color: BRAND.colors.accent },
  });

  // Confidential text
  slide.addText('Confidential', {
    x: 0.75,
    y: 6.9,
    w: 2,
    h: 0.3,
    fontSize: 9,
    fontFace: BRAND.fonts.body,
    color: BRAND.colors.textMuted,
  });

  // Slide number and context
  slide.addText(`${slideNum} | ${context}`, {
    x: SLIDE_WIDTH - 4,
    y: 6.9,
    w: 3.25,
    h: 0.3,
    fontSize: 9,
    fontFace: BRAND.fonts.body,
    color: BRAND.colors.textMuted,
    align: 'right',
  });
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node convert-html-to-pptx.js <input.html> [output.pptx]');
    console.log('');
    console.log('Converts HTML slideshow presentations to PowerPoint format.');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputPath = args[1] || inputPath.replace(/\.html?$/i, '.pptx');

  // Verify input file exists
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  console.log(`Converting: ${inputPath}`);
  console.log(`Output: ${outputPath}`);

  try {
    // Read and parse HTML
    const htmlContent = fs.readFileSync(inputPath, 'utf8');
    const data = parseHTML(htmlContent);

    console.log(`Found ${data.slides.length} slides`);

    // Create PowerPoint
    await createPowerPoint(data, outputPath);

    console.log('Conversion complete!');
  } catch (error) {
    console.error('Error during conversion:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseHTML, createPowerPoint };
