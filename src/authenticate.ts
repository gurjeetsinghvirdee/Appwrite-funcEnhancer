import * as vscode from 'vscode';

export async function authenticate(context: vscode.ExtensionContext): Promise<void> {
    const endpoint = await vscode.window.showInputBox({ prompt: 'Enter Appwrite Endpoint' });
    const projectId = await vscode.window.showInputBox({ prompt: 'Enter Appwrite Project ID' });
    const apiKey = await vscode.window.showInputBox({ prompt: 'Enter Appwrite API Key', password: true });

    if (!endpoint || !projectId || !apiKey) {
        vscode.window.showErrorMessage('All credentials are required!');
        return;
    }

    // Store credentials securely
    await context.secrets.store('appwrite-endpoint', endpoint);
    await context.secrets.store('appwrite-project-id', projectId);
    await context.secrets.store('appwrite-api-key', apiKey);

    vscode.window.showInformationMessage('Credentials stored securely!')
}