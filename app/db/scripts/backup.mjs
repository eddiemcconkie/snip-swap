import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { config } from 'dotenv';
config();

const timestamp = new Date().toISOString();

const file = path.resolve('db', 'backups', `${timestamp}.surql`);

const { PUBLIC_SURREAL_HOST, SURREAL_USER, SURREAL_PASS, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB } =
  process.env;

exec(
  `surreal export --conn ${PUBLIC_SURREAL_HOST} --user ${SURREAL_USER} --pass ${SURREAL_PASS} --ns ${PUBLIC_SURREAL_NS} --db ${PUBLIC_SURREAL_DB} ${file}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.log('Successfully backed up ' + file, '\t', stderr.trim());
  },
);
