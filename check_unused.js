import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const srcDir = path.join(cwd, 'src');
const assetsDir = path.join(cwd, 'public/assets');

const files = fs.readdirSync(assetsDir).filter(f => fs.statSync(path.join(assetsDir, f)).isFile());
const srcFiles = [];

function getFiles(dir) {
    const items = fs.readdirSync(dir);
    for (let i of items) {
        const p = path.join(dir, i);
        if (fs.statSync(p).isDirectory()) {
            getFiles(p);
        } else if (p.endsWith('.jsx') || p.endsWith('.css') || p.endsWith('.js')) {
            srcFiles.push(p);
        }
    }
}

getFiles(srcDir);
const contents = srcFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

let out = '';
files.forEach(f => {
    const used = contents.includes(f) || contents.includes(encodeURI(f));
    out += `${f}: ${used ? 'USED' : 'UNUSED'}\n`;
});

fs.writeFileSync('assets_status.txt', out);
console.log('Done!');
