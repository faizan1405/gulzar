const { execSync } = require('child_process');
const fs = require('fs');

const outFile = 'c:\\Users\\Faiza\\Downloads\\012\\website\\Gulzar bhai\\git_output_absolute.txt';

try {
  fs.writeFileSync(outFile, 'STARTING DEBUG\n');
  const status = execSync('git status').toString();
  fs.appendFileSync(outFile, 'STATUS:\n' + status + '\n\n');
  
  execSync('git add .');
  execSync('git commit -m "update"');
  
  const push = execSync('git push origin main 2>&1').toString();
  fs.appendFileSync(outFile, 'PUSH:\n' + push);
} catch (error) {
  fs.appendFileSync(outFile, 'ERROR:\n' + (error.stdout ? error.stdout.toString() : '') + '\n' + (error.stderr ? error.stderr.toString() : error.message));
}
