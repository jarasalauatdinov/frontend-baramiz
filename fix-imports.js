const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /@\/api\//g, to: '@/shared/api/' },
  { from: /@\/lib\//g, to: '@/shared/lib/' },
  { from: /@\/types\//g, to: '@/shared/types/' },
  { from: /@\/styles\//g, to: '@/app/styles/' },
  { from: /@\/components\/layout\//g, to: '@/shared/ui/layout/' },
  { from: /@\/components\/shared\//g, to: '@/shared/ui/shared/' },
  { from: /@\/components\/state\//g, to: '@/shared/ui/state/' },
  { from: /@\/components\/places\//g, to: '@/entities/place/ui/' },
  { from: /@\/components\/route\//g, to: '@/entities/route/ui/' },
  { from: /@\/components\/content\//g, to: '@/entities/content/ui/' },
  { from: /@\/components\/admin\//g, to: '@/features/admin/ui/' },
];

function processDirectory(dir) {
  let ObjectCounter = 0;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file === 'node_modules') continue;
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          ObjectCounter += processDirectory(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
          let content = fs.readFileSync(fullPath, 'utf8');
          let modified = false;
          for (const r of replacements) {
            if (content.match(r.from)) {
              content = content.replace(r.from, r.to);
              modified = true;
            }
          }
          if (modified) {
            fs.writeFileSync(fullPath, content, 'utf8');
            ObjectCounter++;
            console.log(`Updated imports in ${fullPath}`);
          }
        }
      } catch (e) {
        console.error("Error with file: " + fullPath, e.message);
      }
    }
  } catch (e) {
    console.error("Error reading dir: " + dir, e.message);
  }
  return ObjectCounter;
}

console.log("Starting import replacement...");
const count = processDirectory(path.join(process.cwd(), 'src'));
console.log(`Done. Updated ${count} files.`);
