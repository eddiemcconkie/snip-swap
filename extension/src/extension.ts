// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { checkApiKeyOnSetup, promptApiKey, withApiKey } from './api-key';
import { loadSnippets } from './snippets';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  checkApiKeyOnSetup();

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  // let disposable = vscode.commands.registerCommand('snipswap.addApiKey', promptApiKey);
  const disposables = [
    vscode.commands.registerCommand('snipswap.addApiKey', promptApiKey),
    vscode.commands.registerCommand('snipswap.loadSnippets', withApiKey(loadSnippets, context)),
  ];

  context.subscriptions.push(...disposables);

  const path = getSnippetsUri(context);
  vscode.workspace.fs.readFile(path).then(
    () => {
      // File exists!
    },
    () => {
      // Create the snippet file
      vscode.workspace.fs.writeFile(path, encode(''));
    },
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}

export function encode(input: string) {
  return new TextEncoder().encode(input);
}

export function getSnippetsUri(context: vscode.ExtensionContext) {
  return vscode.Uri.joinPath(context.extensionUri, 'snipswap.code-snippets');
}
