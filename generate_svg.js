const fs = require('fs');
const { execSync } = require('child_process');

const challenges = [
  "qr-code-component",
  "product-preview-card-component",
  "interactive-rating-component",
  "results-summary-component",
  "order-summary-component",
  "stats-preview-card-component"
]; // Add all your challenge slugs here

const branchStatus = {};
const gitBranches = execSync('git branch -r').toString().split('\n').map(b => b.trim());

challenges.forEach(challenge => {
  const branchExists = gitBranches.some(b => b.includes(challenge));
  const isMerged = gitBranches.some(b => b.includes(`main`) && !gitBranches.includes(`remotes/origin/${challenge}`));
  
  if (isMerged) {
    branchStatus[challenge] = 'green'; // Completed
  } else if (branchExists) {
    branchStatus[challenge] = 'yellow'; // In progress
  } else {
    branchStatus[challenge] = 'grey'; // Not started
  }
});

function createSVG(status) {
  const size = 50;
  const padding = 15;
  const itemsPerRow = 5;
  
  const svgItems = challenges.map((challenge, index) => {
    const x = (index % itemsPerRow) * (size + padding);
    const y = Math.floor(index / itemsPerRow) * (size + padding);
    const color = status[challenge];
    
    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${size / 2 - 5}" fill="${color}" stroke="black" stroke-width="2" />
            <text x="${x + size / 2}" y="${y + size / 2 + 5}" font-family="Arial" font-size="10" text-anchor="middle" fill="white">${index + 1}</text>
            <title>${challenge.replace(/-/g, ' ')}</title>`;
  }).join('');
  
  const rows = Math.ceil(challenges.length / itemsPerRow);
  const width = itemsPerRow * (size + padding);
  const height = rows * (size + padding);
  
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
            ${svgItems}
          </svg>`;
}

const svg = createSVG(branchStatus);
let readmeContent = fs.readFileSync('README.md', 'utf-8');

const svgPlaceholder = '';
const svgEndPlaceholder = '';

if (readmeContent.includes(svgPlaceholder)) {
  const start = readmeContent.indexOf(svgPlaceholder) + svgPlaceholder.length;
  const end = readmeContent.indexOf(svgEndPlaceholder);
  readmeContent = readmeContent.substring(0, start) + '\n' + svg + '\n' + readmeContent.substring(end);
} else {
  readmeContent += `\n\n${svgPlaceholder}\n${svg}\n${svgEndPlaceholder}`;
}

fs.writeFileSync('README.md', readmeContent);