const fs = require('fs');
const path = require('path');

// Read the transcript files from input folder
const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Parse markdown transcript to extract metadata and content
function parseTranscript(content) {
  const lines = content.split('\n');
  let metadata = {
    title: '',
    project: 'White & Warren Business Central Implementation',
    sprint: 'Sprint 1',
    session: '',
    date: '',
    attendees: []
  };

  let transcriptContent = [];
  let inTranscript = false;

  for (const line of lines) {
    // Extract metadata
    if (line.startsWith('# ')) {
      metadata.title = line.replace('# ', '').trim();
    }
    if (line.includes('**Session:**')) {
      metadata.session = line.replace(/.*\*\*Session:\*\*\s*/, '').trim();
    }
    if (line.includes('**Date:**')) {
      const dateStr = line.replace(/.*\*\*Date:\*\*\s*/, '').trim();
      // Parse ISO date to readable format
      const date = new Date(dateStr);
      metadata.date = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    if (line.includes('**Attendees:**')) {
      const attendeesStr = line.replace(/.*\*\*Attendees:\*\*\s*/, '').trim();
      metadata.attendees = attendeesStr.split(',').map(a => a.trim());
    }

    // Capture transcript content
    if (line.startsWith('## Transcript')) {
      inTranscript = true;
      continue;
    }
    if (inTranscript && line.trim()) {
      transcriptContent.push(line);
    }
  }

  return { metadata, transcriptContent };
}

// Extract key topics from transcript (basic extraction)
function extractTopics(transcriptContent) {
  const topics = new Set();
  const keywords = [
    'invoice', 'payment', 'order', 'shipping', 'warehouse', 'inventory',
    'prepayment', 'AP', 'AR', 'GL', 'cost', 'pricing', 'tax', 'customer',
    'vendor', 'purchase', 'sales', 'return', 'credit', 'debit', 'reconciliation',
    'import', 'export', 'integration', 'workflow', 'process', 'approval',
    'Business Central', 'BC', 'RLM', 'system', 'report', 'tracking'
  ];

  const content = transcriptContent.join(' ').toLowerCase();

  for (const keyword of keywords) {
    if (content.includes(keyword.toLowerCase())) {
      topics.add(keyword);
    }
  }

  return Array.from(topics).slice(0, 8);
}

// Extract speaker segments for analysis
function extractSpeakers(transcriptContent) {
  const speakers = new Set();
  for (const line of transcriptContent) {
    const match = line.match(/^### (.+?) \(/);
    if (match) {
      speakers.add(match[1]);
    }
  }
  return Array.from(speakers);
}

// Generate agenda items based on session type
function generateAgenda(session) {
  const baseAgenda = [
    'Process Flow Progress',
    'Key Requirements Review',
    'Key Decisions',
    'Demo & Walkthrough',
    'Gaps & Issues',
    'Homework & Action Items'
  ];

  return baseAgenda.map(item => `<li>${item}</li>`).join('\n                ');
}

// Format date for display
function formatDate(dateStr) {
  if (!dateStr) return 'January 2026';
  return dateStr;
}

// Escape HTML entities
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Generate the HTML presentation
function generateHTML(metadata, transcriptContent) {
  const topics = extractTopics(transcriptContent);
  const speakers = extractSpeakers(transcriptContent);

  // Determine area name from session
  const areaName = metadata.session || 'Shadowing Session';
  const sprintInfo = `${metadata.sprint} | Week 3 | Show & Tell`;
  const sprintNum = metadata.sprint;

  // Generate dynamic content based on transcript analysis
  const processFlowRows = generateProcessFlowRows(metadata.session);
  const requirementsRows = generateRequirementsRows(topics, transcriptContent);
  const decisionsRows = generateDecisionsRows(transcriptContent);
  const currentGoalsRows = generateCurrentGoalsRows(metadata.session);
  const futureGoalsRows = generateFutureGoalsRows(metadata.session);
  const gapsRows = generateGapsRows(transcriptContent);
  const homeworkRows = generateHomeworkRows(transcriptContent, speakers);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(metadata.project)} - Show and Tell - ${escapeHtml(areaName)}</title>
    <!-- Volt Technologies Brand Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400;500;600&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-dark: #000000;
            --primary-light: #1a1a1a;
            --accent-gold: #D4AF37;
            --accent-gold-light: #F5D547;
            --bg-light: #FFFFFF;
            --bg-gray: #F5F5F5;
            --text-dark: #000000;
            --text-muted: #555555;
            --border-color: #E0E0E0;
            --table-header: #000000;
            --table-row-alt: #F9F9F9;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        html, body {
            height: 100%;
            overflow: hidden;
        }

        body {
            font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            background-color: var(--bg-light);
            color: var(--text-dark);
            line-height: 1.6;
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: 'Montserrat', sans-serif;
        }

        /* Slideshow Container */
        .slideshow-container {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
        }

        /* Individual Slides */
        .slide {
            display: none;
            width: 100%;
            height: 100%;
            overflow-y: auto;
        }

        .slide.active {
            display: flex;
            flex-direction: column;
        }

        /* Navigation */
        .nav-container {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.95);
            padding: 15px 30px;
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        .nav-btn {
            background: transparent;
            border: 2px solid var(--accent-gold);
            color: var(--accent-gold);
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }

        .nav-btn:hover {
            background: var(--accent-gold);
            color: var(--primary-dark);
        }

        .nav-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
        }

        .nav-btn:disabled:hover {
            background: transparent;
            color: var(--accent-gold);
        }

        .slide-counter {
            color: white;
            font-size: 1rem;
            font-weight: 600;
            min-width: 80px;
            text-align: center;
        }

        /* Progress Bar */
        .progress-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: var(--border-color);
            z-index: 1001;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--accent-gold), var(--accent-gold-light));
            transition: width 0.3s ease;
            width: 0%;
        }

        /* Title Slide */
        .title-slide {
            background: linear-gradient(135deg, var(--primary-dark) 0%, #111111 100%);
            color: white;
            height: 100%;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 40px;
            position: relative;
        }

        .title-slide::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 30%;
            height: 100%;
            background: linear-gradient(135deg, transparent 50%, rgba(212,175,55,0.1) 50%);
        }

        .title-content {
            position: relative;
            z-index: 1;
        }

        .title-content h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }

        .title-content h2 {
            font-size: 1.8rem;
            font-weight: 400;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .title-content .sprint-info {
            font-size: 1.4rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--accent-gold);
        }

        .title-content .date {
            font-size: 1.2rem;
            opacity: 0.8;
        }

        .title-content .logo {
            margin-top: 40px;
            font-size: 1rem;
            color: var(--accent-gold);
            letter-spacing: 3px;
        }

        /* Section Dividers */
        .section-divider {
            background: linear-gradient(135deg, var(--primary-dark) 0%, #111111 100%);
            color: white;
            height: 100%;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 40px;
            position: relative;
        }

        .section-divider::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 25%;
            height: 100%;
            background: linear-gradient(135deg, transparent 50%, rgba(212,175,55,0.1) 50%);
        }

        .section-divider h2 {
            font-size: 3rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
        }

        .section-divider .subtitle {
            margin-top: 20px;
            font-size: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            opacity: 0.8;
            position: relative;
            z-index: 1;
            color: var(--accent-gold);
        }

        /* Content Slides */
        .content-slide {
            background: var(--bg-light);
            height: 100%;
            padding: 80px 100px 120px;
            position: relative;
        }

        .content-slide::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(90deg, var(--primary-dark) 0%, var(--accent-gold) 100%);
        }

        .content-slide h2 {
            color: var(--primary-dark);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
        }

        .content-slide .slide-subtitle {
            color: var(--accent-gold);
            font-size: 1.1rem;
            margin-bottom: 30px;
        }

        .content-slide > p {
            color: var(--text-muted);
            margin-bottom: 25px;
            font-size: 1.1rem;
        }

        .table-container {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 20px;
        }

        /* Tables */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 1rem;
        }

        .data-table thead th {
            background: var(--table-header);
            color: white;
            padding: 18px 24px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.9rem;
            letter-spacing: 0.5px;
            position: sticky;
            top: 0;
        }

        .data-table tbody tr {
            border-bottom: 1px solid var(--border-color);
        }

        .data-table tbody tr:nth-child(even) {
            background: var(--table-row-alt);
        }

        .data-table tbody td {
            padding: 18px 24px;
            color: var(--text-dark);
        }

        /* Status badges */
        .status-open {
            background: #FED7D7;
            color: #C53030;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            display: inline-block;
        }

        .status-closed {
            background: #C6F6D5;
            color: #276749;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            display: inline-block;
        }

        .priority-high {
            color: #C53030;
            font-weight: 600;
        }

        .priority-med {
            color: #D69E2E;
            font-weight: 600;
        }

        .priority-low {
            color: #38A169;
            font-weight: 600;
        }

        /* Agenda List */
        .agenda-list {
            list-style: none;
            padding: 0;
            margin-top: 40px;
            position: relative;
            z-index: 1;
        }

        .agenda-list li {
            padding: 20px 0;
            padding-left: 40px;
            position: relative;
            font-size: 1.5rem;
            color: white;
        }

        .agenda-list li::before {
            content: '■';
            position: absolute;
            left: 0;
            color: var(--accent-gold);
            font-size: 1.2rem;
        }

        /* Slide Footer */
        .slide-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            font-size: 0.85rem;
            color: var(--text-muted);
            border-top: 3px solid var(--accent-gold);
            margin-top: auto;
        }

        .slide-footer .page-num {
            background: var(--accent-gold);
            color: white;
            padding: 4px 12px;
            font-weight: 600;
        }

        .slide-footer .confidential {
            color: var(--text-muted);
            font-size: 0.8rem;
        }

        /* Thank You Slide */
        .thank-you-slide {
            background: linear-gradient(135deg, #111111 0%, var(--primary-dark) 100%);
            color: var(--accent-gold);
            height: 100%;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .thank-you-slide h2 {
            font-size: 5rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 4px;
        }

        .thank-you-slide .logo {
            margin-top: 40px;
            font-size: 1.2rem;
            color: white;
            letter-spacing: 3px;
        }

        /* Slide Thumbnails Panel */
        .thumbnails-panel {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 2000;
            display: none;
            padding: 40px;
            overflow-y: auto;
        }

        .thumbnails-panel.active {
            display: block;
        }

        .thumbnails-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .thumbnail {
            aspect-ratio: 16/9;
            background: var(--primary-dark);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 0.9rem;
            padding: 15px;
            text-align: center;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 3px solid transparent;
        }

        .thumbnail:hover {
            transform: scale(1.05);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .thumbnail.current {
            border-color: var(--accent-gold);
        }

        .thumbnails-header {
            color: white;
            text-align: center;
            margin-bottom: 30px;
            font-size: 1.5rem;
        }

        .close-thumbnails {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-gold);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 2001;
        }

        /* Print styles */
        @media print {
            .nav-container, .progress-container, .thumbnails-panel { display: none !important; }
            .slide {
                display: flex !important;
                flex-direction: column !important;
                position: relative !important;
                page-break-after: always;
                height: auto !important;
                min-height: 100vh;
            }
            .slideshow-container {
                height: auto;
                overflow: visible;
            }
            html, body {
                height: auto;
                overflow: visible;
            }
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .content-slide { padding: 60px 50px 100px; }
            .title-content h1 { font-size: 2.5rem; }
            .section-divider h2 { font-size: 2.2rem; }
        }

        @media (max-width: 768px) {
            .content-slide { padding: 50px 30px 100px; }
            .title-content h1 { font-size: 2rem; }
            .section-divider h2 { font-size: 1.8rem; }
            .data-table { font-size: 0.85rem; }
            .data-table thead th,
            .data-table tbody td { padding: 12px 14px; }
            .nav-container { padding: 10px 20px; gap: 15px; }
            .nav-btn { width: 40px; height: 40px; font-size: 1.2rem; }
            .agenda-list li { font-size: 1.2rem; }
        }
    </style>
</head>
<body>
    <!-- Progress Bar -->
    <div class="progress-container">
        <div class="progress-bar" id="progressBar"></div>
    </div>

    <!-- Navigation -->
    <nav class="nav-container">
        <button class="nav-btn" id="prevBtn" onclick="changeSlide(-1)" title="Previous slide (←)">‹</button>
        <span class="slide-counter"><span id="currentSlide">1</span> / <span id="totalSlides">1</span></span>
        <button class="nav-btn" id="nextBtn" onclick="changeSlide(1)" title="Next slide (→)">›</button>
    </nav>

    <!-- Slide Thumbnails Panel -->
    <div class="thumbnails-panel" id="thumbnailsPanel">
        <button class="close-thumbnails" onclick="closeThumbnails()">×</button>
        <h2 class="thumbnails-header">Go to Slide (Press G to toggle)</h2>
        <div class="thumbnails-grid" id="thumbnailsGrid"></div>
    </div>

    <!-- Slideshow Container -->
    <div class="slideshow-container" id="slideshowContainer">

        <!-- Slide 1: Title Slide -->
        <section class="slide title-slide active" data-slide="1" data-title="Title">
            <div class="title-content">
                <h1>${escapeHtml(areaName)}</h1>
                <h2>${escapeHtml(metadata.project)}</h2>
                <div class="sprint-info">${escapeHtml(sprintInfo)}</div>
                <div class="date">${escapeHtml(formatDate(metadata.date))}</div>
                <div class="logo">VOLT TECHNOLOGIES</div>
            </div>
        </section>

        <!-- Slide 2: Agenda -->
        <section class="slide section-divider" data-slide="2" data-title="Agenda">
            <h2>Agenda</h2>
            <ul class="agenda-list">
                ${generateAgenda(metadata.session)}
            </ul>
        </section>

        <!-- Slide 3: Process Flow Progress -->
        <section class="slide content-slide" data-slide="3" data-title="Process Flow Progress">
            <h2>Process Flow Planned Progress</h2>
            <p class="slide-subtitle">Planned DESIGN completion for current sprint</p>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Process Flow</th>
                            <th>Sprint 1</th>
                            <th>Sprint 2</th>
                            <th>Sprint 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${processFlowRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">3</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 4: Key Requirements Section Divider -->
        <section class="slide section-divider" data-slide="4" data-title="Key Requirements & Decisions">
            <h2>Key Requirements &amp; Decisions</h2>
            <div class="subtitle">${escapeHtml(sprintInfo)}</div>
        </section>

        <!-- Slide 5: Key Requirements -->
        <section class="slide content-slide" data-slide="5" data-title="Key Requirements">
            <h2>Key Requirements</h2>
            <p>Here is a recap of key requirements discovered so far as part of sprint shadowing.</p>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Priority</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${requirementsRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">5</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 6: Key Decisions -->
        <section class="slide content-slide" data-slide="6" data-title="Key Decisions">
            <h2>Key Decisions</h2>
            <p>Here is a list of key decisions that need to be made for this sprint.</p>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Decision</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${decisionsRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">6</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 7: Goals Section Divider -->
        <section class="slide section-divider" data-slide="7" data-title="Goals For This Sprint">
            <h2>Goals For This Sprint</h2>
            <div class="subtitle">${escapeHtml(sprintInfo)}</div>
        </section>

        <!-- Slide 8: Goals for This Sprint -->
        <section class="slide content-slide" data-slide="8" data-title="Current Sprint Goals">
            <h2>Goals For This Sprint</h2>
            <p class="slide-subtitle">What's Covered Today</p>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentGoalsRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">8</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 9: Future Goals Section Divider -->
        <section class="slide section-divider" data-slide="9" data-title="Future Goals">
            <h2>Future Goals</h2>
            <div class="subtitle">${escapeHtml(sprintInfo)}</div>
        </section>

        <!-- Slide 10: Future Goals -->
        <section class="slide content-slide" data-slide="10" data-title="Future Goals Detail">
            <h2>Future Goals</h2>
            <p class="slide-subtitle">What's Not Covered Today</p>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Planned Sprint</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${futureGoalsRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">10</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 11: Demo Section Divider -->
        <section class="slide section-divider" data-slide="11" data-title="Demo">
            <h2>Demo</h2>
            <div class="subtitle">${escapeHtml(sprintInfo)}</div>
        </section>

        <!-- Slide 12: Show & Tell Recap Section Divider -->
        <section class="slide section-divider" data-slide="12" data-title="Show & Tell Recap">
            <h2>Show &amp; Tell Recap</h2>
            <div class="subtitle">${escapeHtml(sprintInfo)}</div>
        </section>

        <!-- Slide 13: Gaps Found -->
        <section class="slide content-slide" data-slide="13" data-title="Gaps Found">
            <h2>Gaps Found</h2>
            <p>The following gaps were identified. Project leadership is reviewing these gaps.</p>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Gap</th>
                            <th>Impact</th>
                            <th>Level of Effort</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${gapsRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">13</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 14: Homework Section Divider -->
        <section class="slide section-divider" data-slide="14" data-title="Homework">
            <h2>Homework</h2>
            <div class="subtitle">${escapeHtml(sprintInfo)}</div>
        </section>

        <!-- Slide 15: Homework -->
        <section class="slide content-slide" data-slide="15" data-title="Homework Detail">
            <h2>Homework</h2>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Follow Up</th>
                            <th>Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${homeworkRows}
                    </tbody>
                </table>
            </div>
            <div class="slide-footer">
                <span class="confidential">Confidential</span>
                <span><span class="page-num">15</span> | SHOW AND TELL – ${escapeHtml(areaName)} - ${escapeHtml(sprintNum)}</span>
            </div>
        </section>

        <!-- Slide 16: Thank You Slide -->
        <section class="slide thank-you-slide" data-slide="16" data-title="Thank You">
            <h2>Thank You!</h2>
            <div class="logo">VOLT TECHNOLOGIES</div>
        </section>

    </div>

    <script>
        // Slideshow State
        let currentSlideIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('totalSlides').textContent = totalSlides;
            generateThumbnails();
            updateSlideUI();
        });

        // Navigate slides
        function changeSlide(direction) {
            const newIndex = currentSlideIndex + direction;
            if (newIndex >= 0 && newIndex < totalSlides) {
                goToSlide(newIndex);
            }
        }

        function goToSlide(index) {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = index;
            slides[currentSlideIndex].classList.add('active');
            updateSlideUI();
            closeThumbnails();
        }

        function updateSlideUI() {
            document.getElementById('currentSlide').textContent = currentSlideIndex + 1;
            document.getElementById('prevBtn').disabled = currentSlideIndex === 0;
            document.getElementById('nextBtn').disabled = currentSlideIndex === totalSlides - 1;

            // Update progress bar
            const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
            document.getElementById('progressBar').style.width = progress + '%';

            // Update thumbnail current state
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.toggle('current', i === currentSlideIndex);
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            const thumbnailsOpen = document.getElementById('thumbnailsPanel').classList.contains('active');

            switch(e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    if (!thumbnailsOpen) {
                        e.preventDefault();
                        changeSlide(1);
                    }
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    if (!thumbnailsOpen) {
                        e.preventDefault();
                        changeSlide(-1);
                    }
                    break;
                case 'Home':
                    if (!thumbnailsOpen) {
                        e.preventDefault();
                        goToSlide(0);
                    }
                    break;
                case 'End':
                    if (!thumbnailsOpen) {
                        e.preventDefault();
                        goToSlide(totalSlides - 1);
                    }
                    break;
                case 'g':
                case 'G':
                    toggleThumbnails();
                    break;
                case 'Escape':
                    if (thumbnailsOpen) {
                        closeThumbnails();
                    }
                    break;
            }
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    changeSlide(1);
                } else {
                    changeSlide(-1);
                }
            }
        }

        // Thumbnails panel
        function generateThumbnails() {
            const grid = document.getElementById('thumbnailsGrid');
            slides.forEach((slide, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'thumbnail' + (index === 0 ? ' current' : '');
                thumb.textContent = slide.dataset.title || 'Slide ' + (index + 1);
                thumb.onclick = () => goToSlide(index);
                grid.appendChild(thumb);
            });
        }

        function toggleThumbnails() {
            document.getElementById('thumbnailsPanel').classList.toggle('active');
        }

        function closeThumbnails() {
            document.getElementById('thumbnailsPanel').classList.remove('active');
        }

        // Click to advance
        document.getElementById('slideshowContainer').addEventListener('click', function(e) {
            if (e.target.closest('.controls, .nav-container, button, a, .table-container')) return;

            const clickX = e.clientX;
            const windowWidth = window.innerWidth;

            if (clickX > windowWidth * 0.7) {
                changeSlide(1);
            } else if (clickX < windowWidth * 0.3) {
                changeSlide(-1);
            }
        });
    </script>
</body>
</html>`;

  return html;
}

// Generate process flow rows based on session type
function generateProcessFlowRows(session) {
  const sessionLower = (session || '').toLowerCase();

  const processFlows = {
    'ap pain points': [
      ['Invoice Processing', '50%', '75%', '100%'],
      ['Vendor Management', '40%', '70%', '100%'],
      ['Payment Processing', '30%', '60%', '100%'],
      ['Prepayment Tracking', '25%', '55%', '100%']
    ],
    'planning': [
      ['Project Planning', '60%', '80%', '100%'],
      ['Resource Allocation', '50%', '75%', '100%'],
      ['Timeline Management', '45%', '70%', '100%'],
      ['Sprint Planning', '55%', '80%', '100%']
    ],
    'b2b order to cash': [
      ['Sales Order Processing', '50%', '75%', '100%'],
      ['B2B Customer Management', '45%', '70%', '100%'],
      ['Invoicing', '40%', '65%', '100%'],
      ['Payment Collection', '35%', '60%', '100%']
    ],
    'b2c order to cash': [
      ['E-commerce Integration', '50%', '75%', '100%'],
      ['Consumer Order Processing', '45%', '70%', '100%'],
      ['Returns Processing', '40%', '65%', '100%'],
      ['Customer Service', '35%', '60%', '100%']
    ],
    'accounts payable': [
      ['Invoice Entry', '55%', '80%', '100%'],
      ['Approval Workflow', '45%', '70%', '100%'],
      ['Payment Scheduling', '40%', '65%', '100%'],
      ['Vendor Reconciliation', '35%', '60%', '100%']
    ],
    'warehouse movements': [
      ['Inventory Receiving', '50%', '75%', '100%'],
      ['Warehouse Transfers', '45%', '70%', '100%'],
      ['Pick & Pack', '40%', '65%', '100%'],
      ['Shipping Integration', '35%', '60%', '100%']
    ],
    'tax management': [
      ['Tax Configuration', '55%', '80%', '100%'],
      ['Tax Calculation', '50%', '75%', '100%'],
      ['Tax Reporting', '45%', '70%', '100%'],
      ['Compliance Tracking', '40%', '65%', '100%']
    ]
  };

  const flows = processFlows[sessionLower] || processFlows['planning'];

  return flows.map(row =>
    `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`
  ).join('\n                        ');
}

// Generate requirements rows from transcript
function generateRequirementsRows(topics, transcriptContent) {
  const sessionContent = transcriptContent.join(' ').toLowerCase();
  const requirements = [];

  // Extract requirements based on common patterns and topics
  if (sessionContent.includes('invoice') || sessionContent.includes('ap')) {
    requirements.push(['Direct invoice entry into Business Central', 'High', 'Volt Team']);
    requirements.push(['Copy invoice functionality for recurring invoices', 'Med', 'W&W Team']);
  }
  if (sessionContent.includes('prepayment')) {
    requirements.push(['Prepayment tracking and reconciliation', 'Med', 'W&W Team']);
  }
  if (sessionContent.includes('banking') || sessionContent.includes('ach')) {
    requirements.push(['Banking information validation on invoices', 'High', 'W&W Team']);
  }
  if (sessionContent.includes('order') || sessionContent.includes('sales')) {
    requirements.push(['Order processing workflow configuration', 'High', 'Volt Team']);
    requirements.push(['Customer order tracking visibility', 'Med', 'W&W Team']);
  }
  if (sessionContent.includes('warehouse') || sessionContent.includes('inventory')) {
    requirements.push(['Warehouse location setup and management', 'High', 'Volt Team']);
    requirements.push(['Inventory movement tracking', 'Med', 'W&W Team']);
  }
  if (sessionContent.includes('tax')) {
    requirements.push(['Tax jurisdiction configuration', 'High', 'Volt Team']);
    requirements.push(['Tax exemption certificate tracking', 'Med', 'W&W Team']);
  }
  if (sessionContent.includes('shipping') || sessionContent.includes('fedex')) {
    requirements.push(['Shipping carrier integration', 'Med', 'Volt Team']);
  }
  if (sessionContent.includes('report')) {
    requirements.push(['Custom reporting requirements', 'Low', 'W&W Team']);
  }

  // Ensure at least some requirements
  if (requirements.length === 0) {
    requirements.push(['Review current process documentation', 'Med', 'W&W Team']);
    requirements.push(['Identify data migration requirements', 'High', 'Volt Team']);
    requirements.push(['Define user access and security roles', 'Med', 'Volt Team']);
  }

  const priorityClass = {'High': 'priority-high', 'Med': 'priority-med', 'Low': 'priority-low'};

  return requirements.map(row =>
    `<tr><td>${row[0]}</td><td><span class="${priorityClass[row[1]]}">${row[1]}</span></td><td>${row[2]}</td></tr>`
  ).join('\n                        ');
}

// Generate decisions rows
function generateDecisionsRows(transcriptContent) {
  const sessionContent = transcriptContent.join(' ').toLowerCase();
  const decisions = [];

  // Extract decision points based on question patterns
  if (sessionContent.includes('spreadsheet') || sessionContent.includes('excel')) {
    decisions.push(['Eliminate manual spreadsheet entry in favor of BC', 'Move to direct BC entry', 'Closed', 'Jan 2026', 'Volt Team']);
  }
  if (sessionContent.includes('rlm')) {
    decisions.push(['Data migration approach from RLM', '', 'Open', '', 'Project Team']);
  }
  if (sessionContent.includes('workflow') || sessionContent.includes('approval')) {
    decisions.push(['Approval workflow configuration', '', 'Open', '', 'W&W Team']);
  }
  if (sessionContent.includes('integration')) {
    decisions.push(['Third-party integration requirements', '', 'Open', '', 'Volt Team']);
  }

  // Ensure at least some decisions
  if (decisions.length === 0) {
    decisions.push(['Process standardization approach', '', 'Open', '', 'Project Team']);
    decisions.push(['Training timeline and approach', '', 'Open', '', 'Volt Team']);
  }

  return decisions.map(row =>
    `<tr><td>${row[0]}</td><td>${row[1]}</td><td><span class="${row[2] === 'Closed' ? 'status-closed' : 'status-open'}">${row[2]}</span></td><td>${row[3]}</td><td>${row[4]}</td></tr>`
  ).join('\n                        ');
}

// Generate current goals rows
function generateCurrentGoalsRows(session) {
  const goals = [
    `Complete ${session} shadowing and documentation`,
    'Identify key pain points and requirements',
    'Document current process workflows',
    'Discuss BC capabilities for addressing pain points',
    'Capture homework items and next steps'
  ];

  return goals.map(goal => `<tr><td>${goal}</td></tr>`).join('\n                        ');
}

// Generate future goals rows
function generateFutureGoalsRows(session) {
  const goals = [
    ['Complete data migration planning', 'Sprint 2'],
    ['Configure BC environment for testing', 'Sprint 2'],
    ['User acceptance testing', 'Sprint 3'],
    ['Training material development', 'Sprint 3'],
    ['Go-live preparation', 'Sprint 4']
  ];

  return goals.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join('\n                        ');
}

// Generate gaps rows
function generateGapsRows(transcriptContent) {
  const sessionContent = transcriptContent.join(' ').toLowerCase();
  const gaps = [];

  if (sessionContent.includes('spreadsheet')) {
    gaps.push(['Manual data entry processes need to be eliminated', 'Medium', 'Low']);
  }
  if (sessionContent.includes('integration') || sessionContent.includes('import')) {
    gaps.push(['Integration requirements need further definition', 'High', 'Medium']);
  }
  if (sessionContent.includes('report') || sessionContent.includes('reporting')) {
    gaps.push(['Custom reporting needs assessment', 'Medium', 'Medium']);
  }

  if (gaps.length === 0) {
    gaps.push(['No significant gaps identified in this session', 'N/A', 'N/A']);
  }

  return gaps.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('\n                        ');
}

// Generate homework rows
function generateHomeworkRows(transcriptContent, speakers) {
  const sessionContent = transcriptContent.join(' ').toLowerCase();
  const homework = [];

  // Default homework items based on content
  homework.push(['Review session notes and validate requirements', 'Next Week', 'W&W Team']);
  homework.push(['Prepare demo environment for Show and Tell', 'Show & Tell', 'Volt Team']);

  if (sessionContent.includes('document') || sessionContent.includes('documentation')) {
    homework.push(['Complete process documentation review', 'Next Sprint', 'W&W Team']);
  }
  if (sessionContent.includes('test') || sessionContent.includes('testing')) {
    homework.push(['Prepare test scenarios', 'Sprint 2', 'Both Teams']);
  }
  if (sessionContent.includes('data') || sessionContent.includes('migration')) {
    homework.push(['Compile data samples for migration testing', 'Sprint 2', 'W&W Team']);
  }

  return homework.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join('\n                        ');
}

// Main processing
function main() {
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md') && f.startsWith('white-warren'));

  console.log(`Found ${files.length} transcript files to process\n`);

  for (const file of files) {
    console.log(`Processing: ${file}`);

    const filepath = path.join(inputDir, file);
    const content = fs.readFileSync(filepath, 'utf8');

    const { metadata, transcriptContent } = parseTranscript(content);
    console.log(`  Title: ${metadata.session}`);
    console.log(`  Date: ${metadata.date}`);
    console.log(`  Attendees: ${metadata.attendees.length}`);
    console.log(`  Transcript lines: ${transcriptContent.length}`);

    const html = generateHTML(metadata, transcriptContent);

    // Generate output filename
    const outputFilename = file.replace('.md', '.html');
    const outputPath = path.join(outputDir, outputFilename);

    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`  Output: ${outputFilename}\n`);
  }

  console.log('All presentations generated successfully!');
  console.log(`Output location: ${outputDir}`);
}

main();
