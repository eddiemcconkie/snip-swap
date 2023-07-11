import { SnippetSchema, snippetSchema } from '@snipswap/schema';
import { Surreal, SurrealConfig, surql } from '@snipswap/surreal';
import * as vscode from 'vscode';
import { z } from 'zod';
import { encode, getSnippetsUri } from './extension';

type VSCodeSnippet = {
  prefix: string;
  body: string[];
  description: string;
  scope: string;
  isFileTemplate: boolean;
};

type VSCodeSnippetFile = Record<string, VSCodeSnippet>;

export const surrealConfig: SurrealConfig = {
  host: process.env.PUBLIC_SURREAL_HOST!,
  ns: process.env.PUBLIC_SURREAL_NS!,
  db: process.env.PUBLIC_SURREAL_DB!,
};

export const connect = (token: string) => new Surreal({ scope: 'extension', token }, surrealConfig);

export async function loadSnippets(token: string, context: vscode.ExtensionContext) {
  const db = connect(token);

  const [snippets] = await db.query(
    surql`
    RETURN (
      SELECT
        ->posted->snippet AS postedSnippets,
        ->saved->snippet AS savedSnippets
      FROM $auth
      FETCH
        postedSnippets, postedSnippets.owner, postedSnippets.collection, postedSnippets.language,
        savedSnippets, savedSnippets.owner, savedSnippets.collection, savedSnippets.language
    )[0]
    `,
    z.object({
      postedSnippets: snippetSchema.array(),
      savedSnippets: snippetSchema.array(),
    }),
  );

  if (!snippets.ok || snippets.count !== 1) {
    vscode.window.showErrorMessage('There was an issue retrieving your saved snippets');
    return;
  }

  const allSnippets = [...snippets.result.postedSnippets, ...snippets.result.savedSnippets];

  writeSnippetsToFile(allSnippets, context);
}

async function writeSnippetsToFile(snippets: SnippetSchema[], context: vscode.ExtensionContext) {
  const fileData: VSCodeSnippetFile = {};

  for (const snippet of snippets) {
    fileData[`SnipSwap: ${snippet.id}`] = {
      body: snippet.code.split(/[\r\n]+/),
      prefix: snippet.code.slice(0, snippet.code.indexOf(' ')),
      description: snippet.description,
      scope: snippet.language.id,
      isFileTemplate: false,
    };
  }

  const path = getSnippetsUri(context);
  vscode.workspace.fs.writeFile(path, encode(JSON.stringify(fileData, null, 2))).then(() => {
    vscode.window.showInformationMessage('Your snippets have been updated! You may need to reload');
  });
}
