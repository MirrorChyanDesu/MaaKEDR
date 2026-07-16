import {existsSync, mkdirSync, copyFileSync, readdirSync, statSync} from "node:fs";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {dirname, resolve} from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "..", "docs", ".vuepress", "dist");

function walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const info = statSync(full);
        if (info.isDirectory()) {
            walk(full);
            continue;
        }
        if (!entry.endsWith(".html")) continue;
        if (entry === "index.html") continue;
        const name = entry.slice(0, -".html".length);
        const targetDir = join(dir, name);
        const targetFile = join(targetDir, "index.html");
        if (!existsSync(targetDir)) {
            mkdirSync(targetDir, {recursive: true});
        }
        copyFileSync(full, targetFile);
    }
}

if (!existsSync(distDir)) {
    console.error(`[fix-docs-urls] dist not found: ${distDir}`);
    process.exit(1);
}

walk(distDir);
console.log("[fix-docs-urls] generated directory-style copies for GitHub Pages deep links");
