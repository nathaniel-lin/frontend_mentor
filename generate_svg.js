const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Get a list of all remote branches, excluding the main branch
  const gitBranches = execSync('git branch -r --list "origin/*" | grep -v "origin/main"')
    .toString()
    .split('\n')
    .map(b => b.trim().replace('origin/', ''))
    .filter(b => b.length > 0)
    .sort();

  let tableContent = `| Challenge | Status |\n|---|---|\n`;

  if (gitBranches.length > 0) {
    gitBranches.forEach(branch => {
      // You can add logic here to determine a status, but for now, it's "In Progress"
      const status = 'In Progress';
      tableContent += `| [${branch.replace(/-/g, ' ')}](https://github.com/${process.env.GITHUB_REPOSITORY}/tree/${branch}) | ${status} |\n`;
    });
  } else {
    tableContent += `| No challenges started yet | - |\n`;
  }

  let readmeContent = fs.readFileSync('README.md', 'utf-8');
  
  const tablePlaceholder = '';
  const tableEndPlaceholder = '';
  
  if (readmeContent.includes(tablePlaceholder)) {
    const start = readmeContent.indexOf(tablePlaceholder) + tablePlaceholder.length;
    const end = readmeContent.indexOf(tableEndPlaceholder);
    readmeContent = readmeContent.substring(0, start) + '\n' + tableContent + '\n' + readmeContent.substring(end);
  } else {
    readmeContent += `\n\n${tablePlaceholder}\n${tableContent}\n${tableEndPlaceholder}`;
  }

  fs.writeFileSync('README.md', readmeContent);

} catch (error) {
  console.error("Error generating table:", error);
}