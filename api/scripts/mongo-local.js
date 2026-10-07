/**
 * Levanta MongoDB en el puerto 27017 para desarrollo local.
 * El binario y los datos viven fuera de OneDrive: la ruta del proyecto
 * supera el límite de Windows y mongod no arranca desde ahí.
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const base = path.join(process.env.LOCALAPPDATA || "C:\\Users\\Public", "pawnee-mongo");
const dbPath = path.join(base, "data");
const binDir = path.join(base, "bin");
const mongodPath = path.join(binDir, "mongod.exe");
const cacheDir = path.join(__dirname, "..", "node_modules", ".cache", "mongodb-memory-server");

fs.mkdirSync(dbPath, { recursive: true });
fs.mkdirSync(binDir, { recursive: true });

function copiarBinario() {
  if (fs.existsSync(mongodPath)) {
    return;
  }
  const candidatos = fs.existsSync(cacheDir)
    ? fs.readdirSync(cacheDir).filter((nombre) => nombre.startsWith("mongod") && nombre.endsWith(".exe"))
    : [];
  if (candidatos.length === 0) {
    throw new Error(
      "No está el binario de MongoDB. Ejecuta npm install en la API y vuelve a correr npm run db."
    );
  }
  fs.copyFileSync(path.join(cacheDir, candidatos[0]), mongodPath);
}

function main() {
  copiarBinario();

  const proceso = spawn(
    mongodPath,
    ["--dbpath", dbPath, "--port", "27017", "--bind_ip", "127.0.0.1"],
    { stdio: "inherit" }
  );

  proceso.on("exit", (codigo) => {
    process.exit(codigo ?? 0);
  });

  const detener = () => {
    proceso.kill();
  };
  process.on("SIGINT", detener);
  process.on("SIGTERM", detener);
}

main();
