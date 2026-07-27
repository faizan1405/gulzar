const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove FloralCorner and GoldDivider components usages completely
    content = content.replace(/<FloralCorner[^>]*\/>[\r\n]*/g, '');
    content = content.replace(/<GoldDivider[^>]*\/>[\r\n]*/g, '');

    // Remove imports of FloralCorner and GoldDivider
    // Like: import { SectionHeading, FloralCorner, PremiumFooter } ...
    content = content.replace(/,\s*FloralCorner/g, '');
    content = content.replace(/FloralCorner\s*,?/g, '');
    content = content.replace(/,\s*GoldDivider/g, '');
    content = content.replace(/GoldDivider\s*,?/g, '');
    
    // Clean up empty imports like: import { } from '...'
    content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?[\r\n]*/g, '');
    
    // Remove empty import { } from '../../components/NikahComponents'; if leftover
    content = content.replace(/import\s*{\s*}\s*from\s*[^;]+;[\r\n]*/g, '');

    if (filePath.includes('Navbar.tsx')) {
        content = content.replace(/<div className="header-top-strip-ornament" \/>[\r\n]*/g, '');
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated', filePath);
    }
}

walkDir(path.join(__dirname, '../src'), processFile);
