import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { db } from './surreal-rest';
config();

const { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB, SURREAL_USER, SURREAL_PASS } =
  process.env;

const args = process.argv.slice(2);
const fileOrFolder = path.resolve('schema', args[0]);
const recursive = args.includes('-r');
if (!fileOrFolder) {
  console.error('Please provide a file or folder path as the first argument');
  process.exit(1);
}

if (isFile(fileOrFolder)) {
  importFile(fileOrFolder);
} else {
  importFolder(fileOrFolder);
}

function isFile(fileOrFolder: string) {
  return fs.statSync(fileOrFolder).isFile();
}

async function importFile(filePath: string) {
  if (!filePath.endsWith('.surql')) return;

  const relativePath = filePath.slice(filePath.indexOf('db') + 3);
  console.log(`Importing ${relativePath}...`);
  const res = await db.import(
    {
      host: PUBLIC_SURREAL_HOST!,
      ns: PUBLIC_SURREAL_NS!,
      db: PUBLIC_SURREAL_DB!,
      username: SURREAL_USER!,
      password: SURREAL_PASS!,
    },
    filePath,
  );
  console.log('Finished ' + relativePath, '\t');
  res.forEach((res, i) => {
    if (res.status === 'ERR') {
      console.error(`Error on statement ${i + 1}: ${res.detail}`);
    }
  });
}

function importFolder(folderPath: string) {
  fs.readdirSync(folderPath).forEach((item) => {
    const fileOrFolder = path.join(folderPath, item);
    if (isFile(fileOrFolder)) {
      importFile(fileOrFolder);
    } else if (recursive) {
      importFolder(fileOrFolder);
    }
  });
}
