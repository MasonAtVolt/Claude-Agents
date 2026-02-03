const pptxgen = require('pptxgenjs');
const path = require('path');

// Volt brand colors
const COLORS = {
    black: '000000',
    white: 'FFFFFF',
    gold: 'D4AF37',
    goldLight: 'F4CF67',
    whiteTransparent: 'CCCCCC'
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

    // Logo placeholder
    slide.addText('VOLT', {
        x: 3, y: 0.8, w: 4, h: 0.8,
        fontSize: 36, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
    });
    slide.addText('TECHNOLOGIES', {
        x: 3, y: 1.5, w: 4, h: 0.4,
        fontSize: 12, fontFace: 'Arial', color: COLORS.white, align: 'center', charSpacing: 4
    });

    // Title
    slide.addText(title, {
        x: 0.5, y: 2.5, w: 9, h: 1,
        fontSize: 44, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center'
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 4.25, y: 3.5, w: 1.5, h: 0.05, fill: { color: COLORS.gold }
    });

    // Subtitle
    slide.addText(subtitle, {
        x: 0.5, y: 3.7, w: 9, h: 0.6,
        fontSize: 24, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center'
    });

    // Meta
    slide.addText(meta, {
        x: 0.5, y: 4.5, w: 9, h: 0.5,
        fontSize: 16, fontFace: 'Arial', color: COLORS.gold, align: 'center'
    });
}

// Helper function to add section slide
function addSectionSlide(title, subtitle = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_SECTION' });

    // Gold divider line
    slide.addShape(pptx.ShapeType.rect, {
        x: 3.5, y: 2.3, w: 3, h: 0.03, fill: { color: COLORS.gold }
    });

    // Title
    slide.addText(title.toUpperCase(), {
        x: 0.5, y: 2.5, w: 9, h: 1,
        fontSize: 40, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
    });

    // Subtitle
    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.5, y: 3.5, w: 9, h: 0.6,
            fontSize: 20, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center'
        });
    }
}

// Helper function to add content slide with bullet points
function addContentSlide(heading, bullets) {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold }
    });

    // Bullet points
    const bulletRows = bullets.map(text => ({
        text: text.replace(/<\/?strong>/g, ''),
        options: {
            fontSize: 22, fontFace: 'Arial', color: COLORS.white,
            bullet: { type: 'bullet', color: COLORS.gold },
            paraSpaceAfter: 12
        }
    }));

    slide.addText(bulletRows, {
        x: 0.5, y: 1.5, w: 9, h: 3.5, valign: 'top'
    });
}

// Helper function to add quote slide
function addQuoteSlide(quote, attribution = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_QUOTE' });

    // Opening quote mark
    slide.addText('"', {
        x: 0.5, y: 1.5, w: 1, h: 1,
        fontSize: 72, fontFace: 'Georgia', color: COLORS.gold, bold: false
    });

    // Quote text
    slide.addText(quote, {
        x: 1, y: 2, w: 8, h: 2,
        fontSize: 28, fontFace: 'Arial', color: COLORS.white, italic: true, align: 'center', valign: 'middle'
    });

    // Closing quote mark
    slide.addText('"', {
        x: 8.5, y: 3.5, w: 1, h: 1,
        fontSize: 72, fontFace: 'Georgia', color: COLORS.gold, bold: false
    });

    // Attribution
    if (attribution) {
        slide.addText(attribution, {
            x: 0.5, y: 4.5, w: 9, h: 0.5,
            fontSize: 16, fontFace: 'Arial', color: COLORS.gold, align: 'center'
        });
    }
}

// Helper function to add stats slide
function addStatsSlide(heading, stats, footnote = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold }
    });

    // Stats grid
    const statWidth = 9 / stats.length;
    stats.forEach((stat, index) => {
        const x = 0.5 + (index * statWidth);

        // Number
        slide.addText(stat.number, {
            x: x, y: 1.8, w: statWidth, h: 1.2,
            fontSize: 48, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
        });

        // Label
        slide.addText(stat.label, {
            x: x, y: 3.0, w: statWidth, h: 0.8,
            fontSize: 16, fontFace: 'Arial', color: COLORS.white, align: 'center'
        });
    });

    // Footnote
    if (footnote) {
        slide.addText(footnote, {
            x: 0.5, y: 4.3, w: 9, h: 0.5,
            fontSize: 16, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center'
        });
    }
}

// Helper for big centered text slides
function addBigTextSlide(mainText, supportText = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    slide.addText(mainText, {
        x: 0.5, y: 1.5, w: 9, h: 2,
        fontSize: 36, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center', valign: 'middle'
    });

    if (supportText) {
        slide.addText(supportText, {
            x: 0.5, y: 3.5, w: 9, h: 1,
            fontSize: 20, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center'
        });
    }
}

// Helper for comparison slides
function addComparisonSlide(heading, before, after, footnote = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold }
    });

    // Before
    slide.addText(before.number, {
        x: 1, y: 2, w: 3, h: 1,
        fontSize: 44, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
    });
    slide.addText(before.label, {
        x: 1, y: 3, w: 3, h: 0.5,
        fontSize: 16, fontFace: 'Arial', color: COLORS.white, align: 'center'
    });

    // Arrow
    slide.addText('→', {
        x: 4, y: 2.2, w: 2, h: 0.8,
        fontSize: 36, color: COLORS.whiteTransparent, align: 'center'
    });

    // After
    slide.addText(after.number, {
        x: 6, y: 2, w: 3, h: 1,
        fontSize: 44, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
    });
    slide.addText(after.label, {
        x: 6, y: 3, w: 3, h: 0.5,
        fontSize: 16, fontFace: 'Arial', color: COLORS.white, align: 'center'
    });

    // Footnote
    if (footnote) {
        slide.addText(footnote, {
            x: 0.5, y: 4, w: 9, h: 0.5,
            fontSize: 16, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center'
        });
    }
}

// Helper for bar chart slides
function addBarChartSlide(heading, bars, footnote = '') {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
    });

    // Gold underline
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold }
    });

    // Find max for scaling
    const maxValue = Math.max(...bars.map(b => b.value));
    const maxHeight = 2.8;

    bars.forEach((bar, i) => {
        const x = 1.5 + (i * 2);
        const height = (bar.value / maxValue) * maxHeight;
        const barY = 4.2 - height;

        // Bar
        slide.addShape(pptx.ShapeType.rect, {
            x: x, y: barY, w: 1.2, h: height, fill: { color: COLORS.gold }
        });

        // Value
        slide.addText(bar.display || bar.value.toString(), {
            x: x, y: barY - 0.4, w: 1.2, h: 0.4,
            fontSize: 18, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
        });

        // Label
        slide.addText(bar.year, {
            x: x, y: 4.3, w: 1.2, h: 0.4,
            fontSize: 14, fontFace: 'Arial', color: COLORS.white, align: 'center'
        });
    });

    // Footnote
    if (footnote) {
        slide.addText(footnote, {
            x: 0.5, y: 4.8, w: 9, h: 0.4,
            fontSize: 16, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center'
        });
    }
}

// Helper for values grid slide
function addValuesGridSlide(heading, values) {
    const slide = pptx.addSlide({ masterName: 'VOLT_CONTENT' });

    // Heading
    slide.addText(heading, {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
    });

    values.forEach((v, i) => {
        const x = 0.5 + (i * 3.2);
        slide.addShape(pptx.ShapeType.rect, {
            x: x, y: 1.5, w: 2.8, h: 2.5, line: { color: COLORS.gold, width: 1 }, fill: { color: '111111' }
        });
        slide.addText(v.number, {
            x: x, y: 1.7, w: 2.8, h: 0.8,
            fontSize: 36, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
        });
        slide.addText(v.title, {
            x: x, y: 2.5, w: 2.8, h: 0.5,
            fontSize: 18, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
        });
    });
}

// Helper for closing slide
function addClosingSlide(title, message) {
    const slide = pptx.addSlide({ masterName: 'VOLT_TITLE' });

    slide.addText(title, {
        x: 0.5, y: 1.5, w: 9, h: 1,
        fontSize: 44, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
    });

    slide.addText(message, {
        x: 0.5, y: 2.7, w: 9, h: 1.5,
        fontSize: 24, fontFace: 'Arial', color: COLORS.white, align: 'center'
    });

    slide.addText('VOLT', {
        x: 3.5, y: 4.2, w: 3, h: 0.5,
        fontSize: 24, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center'
    });
}

// Build the presentation - matching the HTML slideshow
console.log('Building PowerPoint presentation...');

// ========== OPENING ==========

// Slide 1: Title
addTitleSlide('2025 Bonus Dinner', 'Celebrating Our People', 'January 2025');

// Slide 2: Favorite Time of Year
addBigTextSlide('My favorite time of year', 'Our whole team together.\nWith our guests and families.');

// Slide 3: No AI Tonight
addBigTextSlide("We don't have to talk about AI", '(I promise, only a little.)');

// Slide 4: Focus on Celebrating
addBigTextSlide('Tonight we celebrate one another', '');

// ========== THANK YOU TO GUESTS ==========

// Slide 5: Section - To Our Guests
addSectionSlide('To Our Guests', 'The real heroes of tonight');

// Slide 6: Sharing Your People
addBigTextSlide('Thank you for sharing', 'Your spouse. Your friend. Your family member.');

// Slide 7: Support System
addBigTextSlide('Through long nights and high stress days', 'You are the support system behind all our success.');

// Slide 8: Thank You
addSectionSlide('Truly, Thank You');

// ========== SECRET SAUCE ==========

// Slide 9: Secret Sauce
addBigTextSlide('The secret sauce of Volt', 'Our people.');

// Slide 10: More Than Employees
addBigTextSlide("But it's more than just our employees", "It's the families, friends, and communities they support.");

// Slide 11: Energy
addBigTextSlide('You give our team the energy\nto do great work', '');

// ========== CORE VALUES ==========

// Slide 12: What We Exist For
addSectionSlide('What We Exist For', 'Not a Microsoft shop. Something different.');

// Slide 13: Three Core Values
addValuesGridSlide('Our 3 Core Values', [
    { number: '#1', title: 'Happy Employees' },
    { number: '#2', title: 'Happy Customers' },
    { number: '#3', title: 'Great Results' }
]);

// Slide 14: Happy Employees Deep Dive
addContentSlide('Happy Employees First', [
    'Team members who feel satisfied in their work',
    'Providing livelihoods for families and communities',
    'Growing leaders who are more capable and confident'
]);

// Slide 15: The Trade
addBigTextSlide('The Trade', 'We take care of our people.\nWe do excellent work for our customers.\nThe business grows. Everyone wins.');

// Slide 16: This Model Works
addBigTextSlide('This year, we proved this model works', 'Even in a year of incredible volatility.');

// ========== 2025 TESTED US ==========

// Slide 17: Section - The Test
addSectionSlide('2025 Tested Us');

// Slide 18: What Got Tested
addContentSlide('It Tested...', [
    'Our business model',
    'Our leadership',
    'Our discipline and patience'
]);

// Slide 19: Lucky Streak?
addBigTextSlide('Were we on a lucky streak?', 'Or had we built something that could stand the test of time?');

// Slide 20: Good News
addSectionSlide('We Proved We Could');

// Slide 21: What We Proved
addContentSlide('We Proved...', [
    'We can weather storms in the market',
    'We can adapt and still deliver incredible outcomes',
    "Even when conditions aren't perfect"
]);

// Slide 22: The Future
addBigTextSlide('The future rewards those who are\nadaptable and resilient', '');

// Slide 23: Commanders Quote
addQuoteSlide("Commanders don't mean anything until it is wartime.");

// Slide 24: You Were Up to the Task
addBigTextSlide('You proved you were up to the task', '');

// ========== MARKET CHALLENGES ==========

// Slide 25: Section - The Challenge
addSectionSlide('The Challenge');

// Slide 26: Macroeconomic Impacts
addStatsSlide('Macroeconomic Impacts', [
    { number: '3', label: 'Planned projects pushed to 2026' },
    { number: '1', label: 'Project completely pulled the plug' }
]);

// Slide 27: Frozen Decision Making
addBigTextSlide('Decision making froze', 'For our entire industry.');

// Slide 28: Price Pressure
addStatsSlide('Massive Price Pressure', [
    { number: '50%', label: 'Competitor prices dropped' },
    { number: '40%', label: 'Our average deal size dropped' }
]);

// Slide 29: Perfect Storm
addBigTextSlide('The perfect storm', '');

// Slide 30: Churchill Quote
addQuoteSlide('Success is never final, and failure is never fatal. The only thing that counts is the courage to continue.', 'Winston Churchill');

// Slide 31: What We Did
addBigTextSlide('We adapted. We pivoted.\nWe kept delivering.', '');

// ========== CUSTOMER IMPACT ==========

// Slide 32: Section - Customer Impact
addSectionSlide('Customer Impact', 'Where we made the biggest difference');

// Slide 33: Go Lives Chart
addBarChartSlide('Go-Lives By Year', [
    { year: '2022', value: 3 },
    { year: '2023', value: 4 },
    { year: '2024', value: 5 },
    { year: '2025', value: 12 }
], '2025 equals all other years combined');

// Slide 34: Customers Love Us
addBigTextSlide('Our customers love us', 'Case study after case study.');

// Slide 35: Referenceable Customers
addBigTextSlide('Our sales team is overflowing\nwith referenceable customers', '');

// Slide 36: Support Motion
addSectionSlide('Support More Than Doubled');

// Slide 37: Support Numbers
addComparisonSlide('',
    { number: '$1.74M', label: '2024' },
    { number: '$3.56M', label: '2025' },
    'Huge shoutout to our support team.'
);

// Slide 38: Trust Earned
addContentSlide('Trust Earned', [
    'Our quality has taken a leap forward',
    'We can handle more complex customers',
    "We're leapfrogging our competitors"
]);

// Slide 39: Industry Recognition
addBigTextSlide('We are now the premier\nBusiness Central partner', 'Making waves in the channel.');

// Slide 40: This Team
addBigTextSlide('This team can do anything', '');

// ========== TEAM GROWTH ==========

// Slide 41: Section - Team Leveled Up
addSectionSlide('Watching You Level Up', 'The most exciting piece for me');

// Slide 42: Majority Seniors
addBigTextSlide('Majority of our workforce are now\nseniors and managers', '');

// Slide 43: Now Majority Seniors
addBigTextSlide('Now our workforce is majority seniors', "That's why we exist.\nTo help you become more capable, live better lives, and make bigger impact.");

// ========== 2025 RESULTS ==========

// Slide 44: Section - 2025 Results
addSectionSlide('2025 Results', 'Growth in a market downturn');

// Slide 45: Revenue Growth
addComparisonSlide('Revenue Growth',
    { number: '$7.59M', label: '2024' },
    { number: '$8.86M', label: '2025' },
    "17% growth during one of the largest market freezes I've ever experienced."
);

// Slide 46: Revenue By Year Chart
addBarChartSlide('Revenue By Year', [
    { year: '2022', value: 1, display: '$1M' },
    { year: '2023', value: 3.6, display: '$3.6M' },
    { year: '2024', value: 7.5, display: '$7.5M' },
    { year: '2025', value: 8.9, display: '$8.9M' }
], '9x growth in four years');

// Slide 47: Missed 10M
addBigTextSlide('We missed our $10M goal', 'But we still did incredible.');

// Slide 48: Customer Growth
addComparisonSlide('Customer Acquisition',
    { number: '44', label: 'Customers in 2024' },
    { number: '74', label: 'Customers in 2025' },
    '40% growth in our customer base.'
);

// Slide 49: Customer Adds By Year Chart
addBarChartSlide('Customer Adds By Year', [
    { year: '2022', value: 7 },
    { year: '2023', value: 12 },
    { year: '2024', value: 24 },
    { year: '2025', value: 30 }
], '73 new customers over four years');

// Slide 50: Ton of Work
addBigTextSlide('Smaller deal sizes,\nsame amount of work', "That's a ton of effort to bring in those customers.");

// ========== 2026 OUTLOOK ==========

// Slide 51: Section - 2026
addSectionSlide('2026', 'Our best year yet');

// Slide 52: Pipeline Building
addBigTextSlide('So much work behind the scenes', 'Building pipeline for an incredible 2026.');

// Slide 53: Deals Coming
addBigTextSlide('Most deals landing are $400k+', 'Those customers who said "push to 2026"?\nNow they\'re here.');

// Slide 54: Projects Starting
addStatsSlide('After 9 Months of Drought', [
    { number: '8', label: 'Projects started or starting\n(mid-Jan to mid-March)' },
    { number: '$1M+', label: 'Contract bookings\nin January alone' }
]);

// Slide 55: Best Year Yet
addBigTextSlide('2026 is going to be\nour best year yet', '');

// Slide 56: Breaking 10M
addBigTextSlide('We\'re going to break the\n$10M milestone', 'The official 8-figure mark.\nHelping Sunrise hit 9 figures with $100M.');

// Slide 57: 42 Employees
addBigTextSlide('Goal: 42 employees', 'Not doubling headcount. Doubling revenue.\nMore revenue per individual = more for your families.');

// Slide 58: Personal News
addBigTextSlide('One more addition to the\nVolt family', 'Peyton is "half baked" as she calls it.\nA new boy coming in June.');

// Slide 59: 2026 Goals
addStatsSlide('2026 Goals', [
    { number: '36', label: 'New customers' },
    { number: '100', label: 'Total customers' },
    { number: '$6M', label: 'Contract bookings' }
], '25-30% growth for the year.\nA big target. But I believe in this team.');

// ========== AI & FUTURE ==========

// Slide 60: Section - Operating Model
addSectionSlide('The New Operating Model', 'AI and productized services');

// Slide 61: Apparel Products
addBigTextSlide('Our Apparel products\nare changing our business', 'Enabling a recurring business model.\nExpanding into new industries.');

// Slide 62: AI Tools
addContentSlide('AI Tools Already Working', [
    'Notion + AI to auto-generate PowerPoints',
    'Giving back hours if not days to consultants',
    'Data migration tools to automate transformations'
]);

// Slide 63: Screwdrivers to Power Drills
addQuoteSlide("We're moving from screwdrivers to power drills.", "Kevin's Analogy");

// Slide 64: DRAG
const slide64 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide64.addText('AI for the DRAG Tasks', {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Montserrat', color: COLORS.white, bold: true
});
slide64.addShape(pptx.ShapeType.rect, { x: 0.5, y: 1.25, w: 9, h: 0.04, fill: { color: COLORS.gold } });

const drag = [
    { letter: 'D', word: 'Drafting' },
    { letter: 'R', word: 'Research' },
    { letter: 'A', word: 'Analysis' },
    { letter: 'G', word: 'Grunt Work' }
];
drag.forEach((d, i) => {
    const x = 0.6 + (i * 2.35);
    slide64.addShape(pptx.ShapeType.rect, { x: x, y: 1.6, w: 2.1, h: 2.2, line: { color: COLORS.gold, width: 1 }, fill: { color: '111111' } });
    slide64.addText(d.letter, { x: x, y: 1.7, w: 2.1, h: 1, fontSize: 48, fontFace: 'Montserrat', color: COLORS.gold, bold: true, align: 'center' });
    slide64.addText(d.word, { x: x, y: 2.7, w: 2.1, h: 0.5, fontSize: 16, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center' });
});
slide64.addText('The highest leverage for AI.', { x: 0.5, y: 4.2, w: 9, h: 0.5, fontSize: 16, fontFace: 'Arial', color: COLORS.whiteTransparent, align: 'center' });

// Slide 65: Human Touch
addBigTextSlide('Agents do the DRAG\nWe focus on the human touch', 'Working hand in hand with customers.');

// Slide 66: Vision
addQuoteSlide('A company of 100 with the power of 10,000');

// Slide 67: Closer Than Ever
addBigTextSlide('Way closer than I ever imagined', '');

// ========== MISSION ==========

// Slide 68: Section - Mission
addSectionSlide('Our Mission');

// Slide 69: #1 BC Partner
addBigTextSlide('Become the #1\nDynamics 365 Business Central Partner', '');

// Slide 70: 1M SMBs
addBigTextSlide('Impact 1 million\nsmall and midsized companies', 'With cutting edge technology.');

// Slide 71: Clear Path
addBigTextSlide('The path is clear', "Maybe not next year. Maybe not 3 or 5.\nBut we will achieve it. I'm 100% confident.");

// Slide 72: Journey Matters
addBigTextSlide('The mission will be a checkbox', 'What matters most is the journey along the way.');

// Slide 73: What I Hope
const slide73 = pptx.addSlide({ masterName: 'VOLT_CONTENT' });
slide73.addText('My hope is that someday you say:', {
    x: 0.5, y: 1.2, w: 9, h: 0.8,
    fontSize: 28, fontFace: 'Montserrat', color: COLORS.white, bold: true, align: 'center'
});
slide73.addText('"Volt helped me become the best version of myself."', {
    x: 0.5, y: 2.3, w: 9, h: 0.6,
    fontSize: 22, fontFace: 'Arial', color: COLORS.white, align: 'center'
});
slide73.addText('"It helped me scale my impact across my family, friends, and community."', {
    x: 0.5, y: 3.0, w: 9, h: 0.6,
    fontSize: 22, fontFace: 'Arial', color: COLORS.white, align: 'center'
});

// ========== CLOSING THANK YOU ==========

// Slide 74: Section - Thank You
addSectionSlide('Thank You');

// Slide 75: Thank You - Determination
addBigTextSlide('Thank you for the\ndetermination', 'The never-give-up attitude in 2025.');

// Slide 76: Thank You - Results
addBigTextSlide('Thank you for the\nincredible results', 'You delivered for customers.');

// Slide 77: Thank You - Friends
addBigTextSlide('Thank you for being\nmy best friends', '');

// Slide 78: Personal Gratitude
addBigTextSlide('This journey has been crazy', "I'm grateful every day that I get to do it beside each one of you.");

// Slide 79: Looking Forward
addBigTextSlide('In a decade from now...', 'The impact we make will be bigger than any of us expects.');

// Slide 80: Final Thank You
addClosingSlide('Thank You', 'For everything.');

// Slide 81: Transition to Celebration
addSectionSlide("Now Let's Celebrate", 'Time to hand out some money!');

// Save the presentation
const outputPath = path.join(__dirname, 'output/volt-bonus-dinner-2025-v2.pptx');
pptx.writeFile({ fileName: outputPath })
    .then(() => {
        console.log(`\nPowerPoint saved to: ${outputPath}`);
        console.log('Total slides:', pptx.slides.length);
    })
    .catch(err => {
        console.error('Error creating PowerPoint:', err);
    });
