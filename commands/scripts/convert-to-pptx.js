const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Volt brand colors
const COLORS = {
    black: '000000',
    white: 'FFFFFF',
    gold: 'D4AF37',
    goldLight: 'F4CF67'
};

// Create presentation
const pptx = new pptxgen();

// Set presentation properties
pptx.author = 'Volt Technologies';
pptx.title = '2025 Bonus Dinner';
pptx.subject = 'Celebrating Our People';
pptx.company = 'Volt Technologies';

// Define master slide layouts
pptx.defineSlideMaster({
    title: 'VOLT_TITLE',
    background: { color: COLORS.black },
    objects: []
});

pptx.defineSlideMaster({
    title: 'VOLT_SECTION',
    background: { color: COLORS.black },
    objects: []
});

pptx.defineSlideMaster({
    title: 'VOLT_CONTENT',
    background: { color: COLORS.black },
    objects: []
});

pptx.defineSlideMaster({
    title: 'VOLT_QUOTE',
    background: { color: COLORS.black },
    objects: []
});

// Helper function to add title slide
function addTitleSlide(title, subtitle, meta) {
    const slide = pptx.addSlide({ masterName: 'VOLT_TITLE' });

    // Logo placeholder - using text since no logo file exists
    slide.addText('⚡ VOLT', {
        x: 3,
        y: 0.8,
        w: 4,
        h: 0.8,
        fontSize: 36,
        fontFace: 'Montserrat',
        color: COLORS.gold,
        bold: true,
        align: 'center'
    });
    slide.addText('TECHNOLOGIES', {
        x: 3,
        y: 1.5,
        w: 4,
        h: 0.4,
        fontSize: 12,
        fontFace: 'Fira Sans',
        color: COLORS.white,
        align: 'center',
        charSpacing: 4
    });

    // Title
    slide.addText(title, {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 1,
        fontSize: 44,
        fontFace: 'Montserrat',
        color: COLORS.white,
        bold: true,
        align: 'center'
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 4.25,
        y: 3.5,
        w: 1.5,
        h: 0.05,
        fill: { color: COLORS.gold }
    });

    // Subtitle
    slide.addText(subtitle, {
        x: 0.5,
        y: 3.7,
        w: 9,
        h: 0.6,
        fontSize: 24,
        fontFace: 'Fira Sans',
        color: COLORS.white,
        align: 'center'
    });

    // Meta
    slide.addText(meta, {
        x: 0.5,
        y: 4.5,
        w: 9,
        h: 0.5,
        fontSize: 16,
        fontFace: 'Fira Sans',
        color: COLORS.gold,
        align: 'center'
    });
}

// Helper function to add section slide
function addSectionSlide(title, subtitle = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_SECTION' });

    // Gold divider line
    slide.addShape(pptx.ShapeType.rect, {
        x: 3.5,
        y: 2.3,
        w: 3,
        h: 0.03,
        fill: { color: COLORS.gold }
    });

    // Title
    slide.addText(title.toUpperCase(), {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 1,
        fontSize: 40,
        fontFace: 'Montserrat',
        color: COLORS.gold,
        bold: true,
        align: 'center'
    });

    // Subtitle
    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.5,
            y: 3.5,
            w: 9,
            h: 0.6,
            fontSize: 20,
            fontFace: 'Fira Sans',
            color: COLORS.white,
            align: 'center'
        });
    }
}

// Helper function to add content slide with bullet points
function addContentSlide(heading, bullets) {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 32,
        fontFace: 'Montserrat',
        color: COLORS.white,
        bold: true
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.25,
        w: 9,
        h: 0.04,
        fill: { color: COLORS.gold }
    });

    // Bullet points
    const bulletRows = bullets.map(text => ({
        text: text.replace(/<\/?strong>/g, ''),
        options: {
            fontSize: 22,
            fontFace: 'Fira Sans',
            color: COLORS.white,
            bullet: { type: 'bullet', color: COLORS.gold },
            paraSpaceAfter: 12
        }
    }));

    slide.addText(bulletRows, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 3.5,
        valign: 'top'
    });
}

// Helper function to add quote slide
function addQuoteSlide(quote, attribution = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_QUOTE' });

    // Opening quote mark
    slide.addText('"', {
        x: 0.5,
        y: 1.5,
        w: 1,
        h: 1,
        fontSize: 72,
        fontFace: 'Georgia',
        color: COLORS.gold,
        bold: false
    });

    // Quote text
    slide.addText(quote, {
        x: 1,
        y: 2,
        w: 8,
        h: 2,
        fontSize: 28,
        fontFace: 'Fira Sans',
        color: COLORS.white,
        italic: true,
        align: 'center',
        valign: 'middle'
    });

    // Closing quote mark
    slide.addText('"', {
        x: 8.5,
        y: 3.5,
        w: 1,
        h: 1,
        fontSize: 72,
        fontFace: 'Georgia',
        color: COLORS.gold,
        bold: false
    });

    // Attribution
    if (attribution) {
        slide.addText(attribution, {
            x: 0.5,
            y: 4.5,
            w: 9,
            h: 0.5,
            fontSize: 16,
            fontFace: 'Fira Sans',
            color: COLORS.gold,
            align: 'center'
        });
    }
}

// Helper function to add stats slide
function addStatsSlide(heading, stats, footnote = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 0.8,
        fontSize: 32,
        fontFace: 'Montserrat',
        color: COLORS.white,
        bold: true
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 1.25,
        w: 9,
        h: 0.04,
        fill: { color: COLORS.gold }
    });

    // Stats grid
    const statWidth = 9 / stats.length;
    stats.forEach((stat, index) => {
        const x = 0.5 + (index * statWidth);

        // Number
        slide.addText(stat.number, {
            x: x,
            y: 1.8,
            w: statWidth,
            h: 1.2,
            fontSize: 48,
            fontFace: 'Montserrat',
            color: COLORS.gold,
            bold: true,
            align: 'center'
        });

        // Label
        slide.addText(stat.label, {
            x: x,
            y: 3.0,
            w: statWidth,
            h: 0.8,
            fontSize: 16,
            fontFace: 'Fira Sans',
            color: COLORS.white,
            align: 'center'
        });
    });

    // Footnote
    if (footnote) {
        slide.addText(footnote, {
            x: 0.5,
            y: 4.3,
            w: 9,
            h: 0.5,
            fontSize: 16,
            fontFace: 'Fira Sans',
            color: COLORS.white,
            align: 'center'
        });
    }
}

// Helper for big centered text slides
function addBigTextSlide(mainText, supportText = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Parse the main text for highlights
    const cleanMain = mainText.replace(/<span class="highlight">([^<]+)<\/span>/g, '$1');

    slide.addText(cleanMain, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 2,
        fontSize: 36,
        fontFace: 'Montserrat',
        color: COLORS.white,
        bold: true,
        align: 'center',
        valign: 'middle'
    });

    if (supportText) {
        const cleanSupport = supportText.replace(/<[^>]+>/g, '');
        slide.addText(cleanSupport, {
            x: 0.5,
            y: 3.5,
            w: 9,
            h: 1,
            fontSize: 20,
            fontFace: 'Fira Sans',
            color: COLORS.white,
            align: 'center'
        });
    }
}

// Helper for closing slide
function addClosingSlide(title, message) {
    const slide = pptx.addSlide({ masterName: 'VOLT_TITLE' });

    // Title
    slide.addText(title, {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 1,
        fontSize: 44,
        fontFace: 'Montserrat',
        color: COLORS.gold,
        bold: true,
        align: 'center'
    });

    // Message
    slide.addText(message, {
        x: 0.5,
        y: 2.7,
        w: 9,
        h: 1.5,
        fontSize: 24,
        fontFace: 'Fira Sans',
        color: COLORS.white,
        align: 'center'
    });

    // Logo placeholder
    slide.addText('⚡ VOLT', {
        x: 3.5,
        y: 4.2,
        w: 3,
        h: 0.5,
        fontSize: 24,
        fontFace: 'Montserrat',
        color: COLORS.gold,
        bold: true,
        align: 'center'
    });
}

// Build the presentation
console.log('Building PowerPoint presentation...');

// Slide 1: Title
addTitleSlide('2025 Bonus Dinner', 'Celebrating Our People', 'January 2025');

// Slide 2: Welcome
addSectionSlide('Welcome', 'To our team, our families, and our community');

// Slide 3: Personal Summary
addContentSlide('Where I\'m Coming From Tonight', [
    'I\'m proud of what we built together',
    'I\'m grateful for every person in this room',
    'I\'m excited about where we\'re heading',
    'And I want to share that story with you'
]);

// Slide 4: Section - The Story
addSectionSlide('The Story of Our Year');

// Slide 5: Quote
addQuoteSlide('Last year was volatile, but it was the year we matured. It was the year we learned how to truly grow.');

// Slide 6: What We Proved
addContentSlide('What We Proved This Year, To Ourselves', [
    'We can weather storms',
    'We can adapt to changing markets',
    'We can deliver great outcomes even when conditions aren\'t perfect',
    'Our business model works - support revenue doubled and now sustains the company',
    'We are resilient'
]);

// Slide 7: What We Do
addContentSlide('What We Actually Do', [
    'We help organizations run better',
    'We give them incredible efficiencies - getting 15 people\'s worth of output from 3',
    'We rescue businesses from chaos',
    'We help owners breathe again'
]);

// Slide 8: The Challenge Section
addSectionSlide('The Challenge', 'What we faced and how we responded');

// Slide 9: Market Pressure
addStatsSlide('The Market Pressure', [
    { number: '4', label: 'Projects pushed to 2026' },
    { number: '9', label: 'Months without a new project' }
], 'Tariff uncertainty froze decision-making across our industry');

// Slide 10: Deal Size Comparison
const slide10 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide10.addText('Deal Size Impact', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
});
slide10.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });
slide10.addText('$525k', { x: 1, y: 2, w: 3, h: 1, fontSize: 44, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
slide10.addText('Avg Deal Size 2024', { x: 1, y: 3, w: 3, h: 0.5, fontSize: 16, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
slide10.addText('→', { x: 4, y: 2.2, w: 2, h: 0.8, fontSize: 36, color: COLORS.white, align: 'center' });
slide10.addText('$306k', { x: 6, y: 2, w: 3, h: 1, fontSize: 44, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
slide10.addText('Avg Deal Size 2025', { x: 6, y: 3, w: 3, h: 0.5, fontSize: 16, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });

// Slide 11: Our Response
addContentSlide('Our Response', [
    'We prioritized what mattered',
    'We protected quality and culture',
    'We kept customers happy',
    'We stayed ready for when the window opened'
]);

// Slide 12: Pipeline Exploding
addBigTextSlide('But now?\nPipeline is exploding', 'Most deals in the pipeline are $500k+ with several at $1M+');

// Slide 13: 5 New Projects
addBigTextSlide('After 9 months of drought...\n5 new projects in the last month', 'That\'s not luck. That\'s preparedness.');

// Slide 14: The Wins Section
addSectionSlide('The Wins', 'What we achieved together');

// Slide 15: Win #1
addStatsSlide('Win #1: We Grew in a Downturn', [
    { number: '17%', label: 'Revenue Growth YoY' },
    { number: '$8.86M', label: 'Total Revenue 2025' },
    { number: '74', label: 'Customers (up from 44)' }
], 'From $7.59M in 2024. Our baseline is rising. That\'s durability.');

// Slide 16: Win #2
addStatsSlide('Win #2: Support More Than Doubled', [
    { number: '105%', label: 'Support Revenue Growth' },
    { number: '$3.56M', label: 'Support in 2025' }
], 'Up from $1.74M in 2024. Long-term relationships. Lasting value. Stability.');

// Slide 17: Win #3
addContentSlide('Win #3: We Executed & Earned Trust', [
    '12 go-lives - that\'s all previous years combined',
    'Most referable customers we\'ve ever had',
    'Quality is still our differentiator',
    'Eric Fink (BC Program Lead) is co-selling directly with us',
    'Microsoft chose us as their poster child for BC fashion'
]);

// Slide 18: Customer Quotes
const slide18 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide18.addText('What Our Customers Say', {
    x: 0.5, y: 0.3, w: 9, h: 0.6,
    fontSize: 28, fontFace: 'Montserrat', color: COLORS.white, bold: true
});
slide18.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.85, w: 9, h: 0.03, fill: { color: COLORS.gold } });

const quotes = [
    { text: '"Throughout the process, they focused on building a trusted relationship with our team and stakeholders. We believe Volt is a true partner."', attr: '— CFO, Allure Bridals' },
    { text: '"I was a little intimidated by an ERP project. But the Volt team didn\'t disappoint. For the first time, I actually understand the data."', attr: '— President, The Montague Company' },
    { text: '"Volt really helped us step outside of ourselves, gain some perspective, and think big-picture about how we can do the job better."', attr: '— COO, Building-Materials Distributor' },
    { text: '"Volt challenged us to look within ourselves and truly find what our business needed."', attr: '— VP, Global Consumer Goods Company' }
];

quotes.forEach((q, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + (col * 4.75);
    const y = 1.1 + (row * 1.9);

    slide18.addShape(pptx.ShapeType.rect, { x: x, y: y, w: 0.05, h: 1.7, fill: { color: COLORS.gold } });
    slide18.addText(q.text, { x: x + 0.15, y: y + 0.1, w: 4.4, h: 1.2, fontSize: 11, fontFace: 'Fira Sans', color: COLORS.white, italic: true });
    slide18.addText(q.attr, { x: x + 0.15, y: y + 1.3, w: 4.4, h: 0.4, fontSize: 10, fontFace: 'Fira Sans', color: COLORS.gold });
});

// Slide 19: Team Leveled Up
addContentSlide('A Team That Leveled Up', [
    'Now, majority of our people are seniors or managers',
    'Nearly 60 people contributing to the mission',
    'Operating at a higher caliber than ever before'
]);

// Slide 20: Why We Exist
addSectionSlide('Why We Exist');

// Slide 21: Values
const slide21 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
const values = [
    { title: 'Happy Employees', desc: 'Providing livelihood and satisfaction' },
    { title: 'Happy Customers', desc: 'Making a real impact on their businesses' },
    { title: 'Great Results', desc: 'Delivering outcomes that matter' }
];
values.forEach((v, i) => {
    const x = 0.5 + (i * 3.2);
    slide21.addShape(pptx.ShapeType.rect, { x: x, y: 1.5, w: 2.8, h: 2.5, line: { color: COLORS.gold, width: 1 }, fill: { color: '111111' } });
    slide21.addText(v.title, { x: x, y: 2, w: 2.8, h: 0.6, fontSize: 18, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide21.addText(v.desc, { x: x + 0.1, y: 2.7, w: 2.6, h: 1, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});

// Slide 22: Evolution Section
addSectionSlide('How We\'ve Evolved');

// Slide 23: Growth Story
const slide23 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide23.addText('Our Growth Story', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true });
slide23.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const years = [
    { year: 'Year 1', count: '3' },
    { year: 'Year 2', count: '10' },
    { year: 'Year 3', count: '20' },
    { year: 'Year 4', count: '34' }
];
years.forEach((y, i) => {
    const x = 1 + (i * 2.25);
    slide23.addText(y.year, { x: x, y: 1.8, w: 2, h: 0.5, fontSize: 16, fontFace: 'Montserrat', color: COLORS.gold, align: 'center' });
    slide23.addText(y.count, { x: x, y: 2.3, w: 2, h: 1, fontSize: 48, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center' });
    slide23.addText('employees', { x: x, y: 3.3, w: 2, h: 0.4, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});

// Slide 24: Go-Lives Chart
const slide24 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide24.addText('Go-Lives Over Time', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true });
slide24.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const goLives = [
    { year: '2022', value: 3, height: 0.7 },
    { year: '2023', value: 4, height: 0.93 },
    { year: '2024', value: 5, height: 1.17 },
    { year: '2025', value: 12, height: 2.8 }
];
goLives.forEach((g, i) => {
    const x = 1.5 + (i * 2);
    const barY = 4.2 - g.height;
    slide24.addShape(pptx.ShapeType.rect, { x: x, y: barY, w: 1.2, h: g.height, fill: { color: COLORS.gold } });
    slide24.addText(g.value.toString(), { x: x, y: barY - 0.4, w: 1.2, h: 0.4, fontSize: 18, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide24.addText(g.year, { x: x, y: 4.3, w: 1.2, h: 0.4, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});
slide24.addText('More go-lives in 2025 than the previous 3 years combined', { x: 0.5, y: 4.8, w: 9, h: 0.4, fontSize: 16, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });

// Slide 25: Customer Adds Chart
const slide25 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide25.addText('New Customers Added', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true });
slide25.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const customers = [
    { year: '2022', value: 7, height: 0.65 },
    { year: '2023', value: 12, height: 1.12 },
    { year: '2024', value: 24, height: 2.24 },
    { year: '2025', value: 30, height: 2.8 }
];
customers.forEach((c, i) => {
    const x = 1.5 + (i * 2);
    const barY = 4.2 - c.height;
    slide25.addShape(pptx.ShapeType.rect, { x: x, y: barY, w: 1.2, h: c.height, fill: { color: COLORS.gold } });
    slide25.addText(c.value.toString(), { x: x, y: barY - 0.4, w: 1.2, h: 0.4, fontSize: 18, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide25.addText(c.year, { x: x, y: 4.3, w: 1.2, h: 0.4, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});
slide25.addText('From 44 to 74 total customers', { x: 0.5, y: 4.8, w: 9, h: 0.4, fontSize: 16, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });

// Slide 26: Revenue Chart
const slide26 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide26.addText('Revenue Growth', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true });
slide26.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const revenue = [
    { year: '2022', value: '$1.0M', height: 0.31 },
    { year: '2023', value: '$3.6M', height: 1.13 },
    { year: '2024', value: '$7.5M', height: 2.36 },
    { year: '2025', value: '$8.9M', height: 2.8 }
];
revenue.forEach((r, i) => {
    const x = 1.5 + (i * 2);
    const barY = 4.2 - r.height;
    slide26.addShape(pptx.ShapeType.rect, { x: x, y: barY, w: 1.2, h: r.height, fill: { color: COLORS.gold } });
    slide26.addText(r.value, { x: x, y: barY - 0.4, w: 1.2, h: 0.4, fontSize: 16, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide26.addText(r.year, { x: x, y: 4.3, w: 1.2, h: 0.4, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});
slide26.addText('From startup to nearly $9M in 4 years', { x: 0.5, y: 4.8, w: 9, h: 0.4, fontSize: 16, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });

// Slide 27: The Future Section
addSectionSlide('The Future', 'Where we\'re heading');

// Slide 28: Building Products
addContentSlide('Building Products, Not Just Projects', [
    'Developing Apparel & Fashion solutions for Business Central',
    'Creating an entry point for the industry we know best',
    'Turning our expertise into repeatable products',
    'Positioning Volt as the #1 BC partner in fashion retail'
]);

// Slide 29: Human Led, Agent Enabled
addBigTextSlide('Human Led\nAgent Enabled', 'Relationships matter. People matter. Trust matters.\nTechnology removes the drudgery and scales our impact.');

// Slide 30: DRAG Concept
const slide30 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide30.addText('AI Replaces the DRAG', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true });
slide30.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const drag = [
    { letter: 'D', word: 'Drafting', desc: 'Documents, emails, deliverables' },
    { letter: 'R', word: 'Research', desc: 'Finding answers, gathering info' },
    { letter: 'A', word: 'Analysis', desc: 'Data review, pattern finding' },
    { letter: 'G', word: 'Grunt Work', desc: 'Data migrations, repetitive tasks' }
];
drag.forEach((d, i) => {
    const x = 0.6 + (i * 2.35);
    slide30.addShape(pptx.ShapeType.rect, { x: x, y: 1.6, w: 2.1, h: 2.4, line: { color: COLORS.gold, width: 1 }, fill: { color: '111111' } });
    slide30.addText(d.letter, { x: x, y: 1.7, w: 2.1, h: 1, fontSize: 48, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide30.addText(d.word, { x: x, y: 2.6, w: 2.1, h: 0.5, fontSize: 16, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center' });
    slide30.addText(d.desc, { x: x + 0.1, y: 3.1, w: 1.9, h: 0.8, fontSize: 11, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});
slide30.addText('So we can focus on the human side - working directly with customers', { x: 0.5, y: 4.2, w: 9, h: 0.5, fontSize: 16, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });

// Slide 31: Vision Quote
addQuoteSlide('A company of 100 people with the power of 10,000');

// Slide 32: Sustainable Growth
addContentSlide('Sustainable, Stable Growth', [
    'Not slow. Not timid. Disciplined.',
    'Scale that protects quality and people',
    'More leadership potential for everyone',
    'More opportunity as we grow'
]);

// Slide 33: What I Want People to Say
const slide33 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide33.addText('What I want people to say:', { x: 0.5, y: 1.2, w: 9, h: 1, fontSize: 36, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center' });
slide33.addText('"Volt helped me become the next level of myself."', { x: 0.5, y: 2.5, w: 9, h: 0.6, fontSize: 22, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
slide33.addText('"Volt prepared me for the future of work."', { x: 0.5, y: 3.1, w: 9, h: 0.6, fontSize: 22, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
slide33.addText('"Volt helped me scale my impact."', { x: 0.5, y: 3.7, w: 9, h: 0.6, fontSize: 22, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });

// Slide 34: Plan for 2026
const slide34 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide34.addText('Plan for 2026', { x: 0.5, y: 0.5, w: 9, h: 0.8, fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true });
slide34.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const plan2026 = [
    { num: '$11.7M', label: 'Revenue Target', sub: '31% growth' },
    { num: '$1.7M', label: 'Profit Target', sub: '24% growth' },
    { num: '36', label: 'Customer Adds', sub: '' }
];
plan2026.forEach((p, i) => {
    const x = 0.8 + (i * 3);
    slide34.addText(p.num, { x: x, y: 1.5, w: 2.8, h: 0.8, fontSize: 36, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide34.addText(p.label, { x: x, y: 2.3, w: 2.8, h: 0.4, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
    if (p.sub) {
        slide34.addText(p.sub, { x: x, y: 2.65, w: 2.8, h: 0.3, fontSize: 12, fontFace: 'Fira Sans', color: COLORS.gold, align: 'center' });
    }
});

const plan2026b = [
    { num: '$6M', label: 'Contract Bookings' },
    { num: '42', label: 'Employees' }
];
plan2026b.forEach((p, i) => {
    const x = 2.3 + (i * 3);
    slide34.addText(p.num, { x: x, y: 3.3, w: 2.8, h: 0.8, fontSize: 36, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide34.addText(p.label, { x: x, y: 4.1, w: 2.8, h: 0.4, fontSize: 14, fontFace: 'Fira Sans', color: COLORS.white, align: 'center' });
});

// Slide 35: Tonight Section
addSectionSlide('Tonight', 'Why we celebrate');

// Slide 36: Thank You Spouses
addSectionSlide('Thank You', 'To the spouses, partners, family, and friends');

// Slide 37: Sacrifice
addBigTextSlide('Thank you for sharing them with this mission', 'For the late nights. The stress. The mental load.\nYou are the support system behind the support system.');

// Slide 38: How I Want You to Feel
addContentSlide('What I Want You to Feel Tonight', [
    'Proud of what we accomplished',
    'Grateful for each other',
    'Seen for your contributions',
    'Excited for where we\'re going'
]);

// Slide 39: Thank You Closing
addClosingSlide('Thank You', 'For betting on this mission.\nFor the sacrifice. For the care.\nFor showing up for each other.');

// Slide 40: Now Let's Celebrate
addSectionSlide('Now Let\'s Celebrate', 'Our Teams & Our People');

// Save the presentation
const outputPath = path.join(__dirname, 'output/volt-bonus-dinner-2025.pptx');
pptx.writeFile({ fileName: outputPath })
    .then(() => {
        console.log(`\nPowerPoint saved to: ${outputPath}`);
        console.log('Total slides:', pptx.slides.length);
    })
    .catch(err => {
        console.error('Error creating PowerPoint:', err);
    });
