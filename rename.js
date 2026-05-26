const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!dirPath.includes('node_modules') && !dirPath.includes('.next') && !dirPath.includes('.git') && !dirPath.includes('build')) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(path.join(dir, f));
    }
  });
};

const extensions = ['.ts', '.tsx', '.js', '.jsx', '.md', '.json', '.html', '.css'];

walkDir(__dirname, (filePath) => {
  if (!extensions.some(ext => filePath.endsWith(ext))) return;
  if (filePath.endsWith('package-lock.json')) return;

  const originalContent = fs.readFileSync(filePath, 'utf8');
  let newContent = originalContent;

  // We replace cases while trying to respect formatting.
  // Case 1: "LNN-Nivaaran"
  newContent = newContent.replace(/LNN-Nivaaran/g, "LNN-Nivaaran");
  // Case 2: "LNN-Nivaaran"
  newContent = newContent.replace(/LNN-Nivaaran/g, "LNN-Nivaaran");
  // Case 3: "lnn-nivaaran"
  newContent = newContent.replace(/lnn-nivaaran/g, "lnn-nivaaran");
  // Case 4: "LNN-Nivaaran" (standalone)
  newContent = newContent.replace(/LNN-Nivaaran/g, "LNN-Nivaaran");

  if (newContent !== originalContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
});

console.log("Renaming completed.");
