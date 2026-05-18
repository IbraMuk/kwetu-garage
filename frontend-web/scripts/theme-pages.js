const fs = require("fs");
const path = require("path");

const appDir = path.join(__dirname, "../src/app/(app)");

function stripDuplicateHeader(s) {
  return s.replace(
    /\s*{\/\* Header \*\/}\s*<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">[\s\S]*?(?=\s*{\/\* |\s*<div className="mb-6)/,
    (match) => {
      const buttons = match.match(/<div className="flex items-center gap-3">[\s\S]*?<\/motion.div>\s*$/);
      if (buttons) {
        const inner = buttons[0]
          .replace('<div className="flex items-center gap-3">', "")
          .replace(/<\/motion.div>\s*$/, "");
        return `\n      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">\n        <div className="flex flex-wrap items-center gap-3">${inner}</div>\n      </div>\n`;
      }
      return "\n";
    }
  );
}

function themeColors(s) {
  return s
    .replace(/mb-6 p-4 bg-white\/80 backdrop-blur border border-slate-200 rounded-2xl/g, "mb-6 glass-panel !p-4")
    .replace(/p-4 bg-white\/80 backdrop-blur border border-slate-200 rounded-2xl/g, "glass-panel !p-4")
    .replace(/text-slate-900/g, "text-white")
    .replace(/text-slate-700/g, "text-gray-300")
    .replace(/text-slate-600/g, "text-gray-300")
    .replace(/text-slate-500/g, "text-gray-400")
    .replace(/border-slate-200/g, "border-white/10")
    .replace(/border-slate-300/g, "border-white/20")
    .replace(/bg-white\/80 backdrop-blur border border-white\/10 rounded-3xl/g, "glass-panel")
    .replace(/hover:bg-slate-50/g, "hover:bg-white/10")
    .replace(/bg-slate-50/g, "bg-white/5");
}

const dirs = fs.readdirSync(appDir, { withFileTypes: true }).filter((d) => d.isDirectory());
for (const d of dirs) {
  if (d.name === "dashboard") continue;
  const p = path.join(appDir, d.name, "page.tsx");
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, "utf8");
  const before = s;
  s = stripDuplicateHeader(s);
  s = themeColors(s);
  if (s !== before) {
    fs.writeFileSync(p, s);
    console.log("updated", d.name);
  }
}
