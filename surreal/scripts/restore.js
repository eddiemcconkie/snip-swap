// src/scripts/restore.ts
import { exec } from "child_process";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
config();
var backupsFolder = path.resolve("db", "backups");
if (!fs.existsSync(backupsFolder)) {
  fs.mkdirSync(backupsFolder);
}
var files = fs.readdirSync(backupsFolder);
var sortedFiles = files.sort((a, b) => a < b ? 1 : -1);
var mostRecentBackup = sortedFiles[0];
if (!mostRecentBackup) {
  console.error("No backups found");
  process.exit(1);
}
var { PUBLIC_SURREAL_HOST, SURREAL_USER, SURREAL_PASS, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB } = process.env;
var backupFile = path.resolve("backups", mostRecentBackup);
var removeDbFile = path.resolve("remove-db.surql");
fs.writeFileSync(
  removeDbFile,
  `REMOVE DATABASE ${PUBLIC_SURREAL_DB};
   DEFINE DATABASE ${PUBLIC_SURREAL_DB};`
);
console.log(`Resetting database ${PUBLIC_SURREAL_DB}...`);
exec(
  `cat ${removeDbFile} | surreal sql --conn ${PUBLIC_SURREAL_HOST} --user ${SURREAL_USER} --pass ${SURREAL_PASS} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
  }
).on("close", () => {
  fs.rmSync(removeDbFile);
  console.log(`Restoring from backup ${mostRecentBackup}...`);
  exec(
    `surreal import --conn ${PUBLIC_SURREAL_HOST} --user ${SURREAL_USER} --pass ${SURREAL_PASS} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB} ${backupFile}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        process.exit(1);
      }
      console.log("Finished restoring from backup", "	", stderr.trim());
    }
  );
});
