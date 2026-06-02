const fs = require("node:fs");
const path = require("node:path");

function copyIfMissing({ src, dest }) {
  if (!fs.existsSync(src)) return { ok: false, reason: `missing src: ${src}` };
  if (fs.existsSync(dest)) return { ok: true, reason: "dest already exists" };

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  return { ok: true, reason: `copied to ${dest}` };
}

function main() {
  if (process.platform !== "win32" || process.arch !== "x64") return;

  const projectRoot = path.resolve(__dirname, "..");
  const src = path.join(
    projectRoot,
    "node_modules",
    "lightningcss-win32-x64-msvc",
    "lightningcss.win32-x64-msvc.node",
  );

  const targets = [
    path.join(
      projectRoot,
      "node_modules",
      "@tailwindcss",
      "node",
      "node_modules",
      "lightningcss",
      "lightningcss.win32-x64-msvc.node",
    ),
    path.join(
      projectRoot,
      "node_modules",
      "lightningcss",
      "lightningcss.win32-x64-msvc.node",
    ),
  ];

  let didAnything = false;
  for (const dest of targets) {
    const { ok, reason } = copyIfMissing({ src, dest });
    if (ok && reason.startsWith("copied")) didAnything = true;
  }

  if (didAnything) {
    // eslint-disable-next-line no-console
    console.log("[postinstall] lightningcss: fixed missing win32 binary");
  }
}

main();
