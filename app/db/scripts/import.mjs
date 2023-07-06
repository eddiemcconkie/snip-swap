import fs from 'fs';
import path from 'path';
import { db } from './surreal-rest.mjs';

const args = process.argv.slice(2);
const fileOrFolder = path.resolve('db', 'schema', args[0]);
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

function isFile(fileOrFolder) {
  return fs.statSync(fileOrFolder).isFile();
}

async function importFile(filePath) {
  if (!filePath.endsWith('.surql')) return;

  const relativePath = filePath.slice(filePath.indexOf('db') + 3);
  console.log(`Importing ${relativePath}...`);
  const res = await db.import(filePath);
  console.log('Finished ' + relativePath, '\t');
  res.forEach((res, i) => {
    if (res.status === 'ERR') {
      console.error(`Error on statement ${i + 1}: ${res.result}`);
    }
  });
}

function importFolder(folderPath) {
  fs.readdirSync(folderPath).forEach((item) => {
    const fileOrFolder = path.join(folderPath, item);
    if (isFile(fileOrFolder)) {
      importFile(fileOrFolder);
    } else if (recursive) {
      importFolder(fileOrFolder);
    }
  });
}

// const importFile = (filePath) => {
//   if (!filePath.endsWith('.surql')) return;

//   const { PUBLIC_SURREAL_HOST, SURREAL_USER, SURREAL_PASS, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB } =
//     process.env;
//   const relativePath = filePath.slice(filePath.indexOf('db') + 3);
//   console.log(`Importing ${relativePath}...`);
//   exec(
//     `surreal import --conn ${PUBLIC_SURREAL_HOST} --user ${SURREAL_USER} --pass ${SURREAL_PASS} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB} ${filePath}`,
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error(error);
//         process.exit(1);
//       }
//       console.log('Finished ' + relativePath, '\t', stderr.trim());
//     },
//   );
// };

// const importFolder = (folderPath) => {
//   fs.readdirSync(folderPath).forEach((item) => {
//     const fileOrFolder = path.join(folderPath, item);
//     if (isFile(fileOrFolder)) {
//       importFile(fileOrFolder);
//     } else if (recursive) {
//       importFolder(fileOrFolder);
//     }
//   });
// };

// if (isFile(fileOrFolder)) {
//   importFile(fileOrFolder);
// } else {
//   importFolder(fileOrFolder);
// }
