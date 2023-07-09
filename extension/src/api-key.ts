import { signIn } from '@snipswap/surreal';
import * as vscode from 'vscode';
import { surrealConfig } from './snippets';

export const API_KEY_CONFIG_KEY = 'snipSwap.apiKey';

export function getExtensionToken(apiKey: string) {
  return signIn({ scope: 'extension', apiKey }, surrealConfig);
}

export function getApiKey() {
  return vscode.workspace.getConfiguration().get<string>(API_KEY_CONFIG_KEY);
}

export function hasApiKey() {
  return Boolean(vscode.workspace.getConfiguration().get(API_KEY_CONFIG_KEY));
}

export async function checkApiKeyOnSetup() {
  const readyMessage = "I've got it ready!";
  const laterMessage = "I'll do it later";
  if (!hasApiKey()) {
    const response = await vscode.window.showInformationMessage(
      'You need to add your SnipSwap API key',
      readyMessage,
      laterMessage,
    );
    if (response === readyMessage) {
      promptApiKey();
    }
  }
}

export async function promptApiKey() {
  const apiKey = await vscode.window.showInputBox({
    prompt: 'Enter your API key from SnipSwap',
  });
  if (apiKey === undefined) {
    return;
  }
  if (apiKey.trim().length === 0) {
    vscode.window.showInformationMessage('No API key was entered');
    return;
  }

  await vscode.workspace.getConfiguration().update(API_KEY_CONFIG_KEY, apiKey.trim(), true);
}

export function withApiKey<T extends any[]>(
  callback: (token: string, ...args: T) => void,
  ...args: T
) {
  return async () => {
    const apiKey = getApiKey();
    if (!apiKey) {
      vscode.window.showWarningMessage('You need to add an API key to use this command!');
      return;
    }

    const token = await getExtensionToken(apiKey);

    if (!token) {
      vscode.window.showErrorMessage(
        'There was an error authenticating. Double-check your API key',
      );
      return;
    }

    callback(token, ...args);
  };
}
