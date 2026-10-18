import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

const zip = new AdmZip();
const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const ignoredFolders = new Set(['node_modules', '.git', '.playwright-cli', 'screenshots', 'dist', 'build', '.aistudio']);

function addFolderToZip(currentDir, relativePath = '') {
  const items = fs.readdirSync(currentDir);
  for (const item of items) {
    if (ignoredFolders.has(item) || item.endsWith('.log')) continue;
    const fullPath = path.join(currentDir, item);
    const itemRelPath = relativePath ? `${relativePath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item !== 'public') {
        addFolderToZip(fullPath, itemRelPath);
      }
    } else {
      const content = fs.readFileSync(fullPath);
      zip.addFile(itemRelPath, content);
    }
  }
}

addFolderToZip(rootDir);

const zipPath = path.join(publicDir, 'MYSTERYUM-Wallet-Mobile.zip');
zip.writeZip(zipPath);
console.log(`Created archive successfully at: ${zipPath}`);

// Also copy as mysteryum-wallet-solana.zip
fs.copyFileSync(zipPath, path.join(publicDir, 'mysteryum-wallet-solana.zip'));
console.log('Archive packaging complete.');
