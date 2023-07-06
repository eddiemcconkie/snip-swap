import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { config } from 'dotenv';
config();

const backupsFolder = path.resolve('db', 'backups');
if (!fs.existsSync(backupsFolder)) {
  fs.mkdirSync(backupsFolder);
}

// find the most recent backup and import it into the database
const files = fs.readdirSync(backupsFolder);
// const sortedFiles = files.sort((a, b) => new Date(a) - new Date(b));
const sortedFiles = files.sort((a, b) => (a < b ? 1 : -1));
const mostRecentBackup = sortedFiles[0];
if (!mostRecentBackup) {
  console.error('No backups found');
  process.exit(1);
}

const { PUBLIC_SURREAL_HOST, SURREAL_USER, SURREAL_PASS, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB } =
  process.env;

const backupFile = path.resolve('db', 'backups', mostRecentBackup);

fs.writeFileSync(
  path.resolve('db', 'remove-db.surql'),
  `REMOVE DATABASE ${PUBLIC_SURREAL_DB};
   DEFINE DATABASE ${PUBLIC_SURREAL_DB};`,
);
const removeDbFile = path.resolve('db', 'remove-db.surql');
console.log(`Resetting database ${PUBLIC_SURREAL_DB}...`);
exec(
  `cat ${removeDbFile} | surreal sql --conn ${PUBLIC_SURREAL_HOST} --user ${SURREAL_USER} --pass ${SURREAL_PASS} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  },
).on('close', () => {
  fs.rmSync(removeDbFile);

  console.log(`Restoring from backup ${mostRecentBackup}...`);
  exec(
    `surreal import --conn ${PUBLIC_SURREAL_HOST} --user ${SURREAL_USER} --pass ${SURREAL_PASS} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB} ${backupFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      console.log('Finished restoring from backup', '\t', stderr.trim());
    },
  );
});
