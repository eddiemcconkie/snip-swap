// src/scripts/import.ts
import { config } from "dotenv";
import fs2 from "fs";
import path from "path";

// src/scripts/surreal-rest.ts
import fs from "fs";

// src/index.ts
import axios from "axios";
function rootInstance(config2) {
  return axios.create({
    baseURL: config2.host,
    auth: {
      username: config2.username,
      password: config2.password
    },
    headers: {
      NS: config2.ns,
      DB: config2.db
    }
  });
}

// src/scripts/surreal-rest.ts
var db = {
  async export(config2, fileName) {
    const response = await rootInstance(config2).get("/export", {
      headers: {
        Accept: "application/octet-stream"
      }
    });
    fs.writeFileSync(fileName, response.data);
  },
  async import(config2, fileName) {
    const fileData = fs.readFileSync(fileName).toString();
    const response = await rootInstance(config2).post("/import", fileData, {
      headers: {
        Accept: "application/json"
      }
    });
    return response.data;
  },
  async sql(config2, query) {
    const response = await rootInstance(config2).post("/sql", query, {
      headers: {
        Accept: "application/json"
      }
    });
    return response.data;
  }
};

// src/scripts/import.ts
config();
var { PUBLIC_SURREAL_HOST, PUBLIC_SURREAL_NS, PUBLIC_SURREAL_DB, SURREAL_USER, SURREAL_PASS } = process.env;
var args = process.argv.slice(2);
var fileOrFolder = path.resolve("db", "schema", args[0]);
var recursive = args.includes("-r");
if (!fileOrFolder) {
  console.error("Please provide a file or folder path as the first argument");
  process.exit(1);
}
if (isFile(fileOrFolder)) {
  importFile(fileOrFolder);
} else {
  importFolder(fileOrFolder);
}
function isFile(fileOrFolder2) {
  return fs2.statSync(fileOrFolder2).isFile();
}
async function importFile(filePath) {
  if (!filePath.endsWith(".surql"))
    return;
  const relativePath = filePath.slice(filePath.indexOf("db") + 3);
  console.log(`Importing ${relativePath}...`);
  const res = await db.import(
    {
      host: PUBLIC_SURREAL_HOST,
      ns: PUBLIC_SURREAL_NS,
      db: PUBLIC_SURREAL_DB,
      username: SURREAL_USER,
      password: SURREAL_PASS
    },
    filePath
  );
  console.log("Finished " + relativePath, "	");
  res.forEach((res2, i) => {
    if (res2.status === "ERR") {
      console.error(`Error on statement ${i + 1}: ${res2.detail}`);
    }
  });
}
function importFolder(folderPath) {
  fs2.readdirSync(folderPath).forEach((item) => {
    const fileOrFolder2 = path.join(folderPath, item);
    if (isFile(fileOrFolder2)) {
      importFile(fileOrFolder2);
    } else if (recursive) {
      importFolder(fileOrFolder2);
    }
  });
}
