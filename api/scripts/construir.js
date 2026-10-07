/**
 * Compila la API y el frontend desde la carpeta api o desde la raiz.
 * Usa el binario de TypeScript con node, para no depender de que "tsc"
 * este en el PATH cuando npm omite devDependencies.
 */
const { execFileSync, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const apiRoot = path.resolve(__dirname, "..");
const tsc = path.join(apiRoot, "node_modules", "typescript", "bin", "tsc");
const frontend = path.resolve(apiRoot, "..", "frontend");

function runNode(args, cwd) {
  execFileSync(process.execPath, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
}

function runNpm(args, cwd) {
  execSync(`npm ${args.join(" ")}`, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
}

if (!fs.existsSync(tsc)) {
  console.error("Falta typescript en api/node_modules. El install de la API no dejo el compilador.");
  process.exit(1);
}

runNode([tsc, "-p", "tsconfig.json"], apiRoot);

if (!fs.existsSync(path.join(frontend, "package.json"))) {
  console.error(
    "No esta la carpeta frontend junto a api. En Render, deja Root Directory vacio: no escribas un punto ni 'api'."
  );
  process.exit(1);
}

runNpm(["install", "--include=dev"], frontend);
runNpm(["run", "build"], frontend);
