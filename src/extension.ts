import * as vscode from 'vscode';
import { AppwriteClient } from '../src/appwriteClient'

export function activate(context: vscode.ExtensionContext) {
    // Register the command
    const createFunctionCommand = vscode.commands.registerCommand('extension.createAppwriteFunction', async () => {
        const functionName = await vscode.window.showInputBox({ prompt: 'Enter Function Name' });
        if (!functionName) {
            vscode.window.showErrorMessage('Function name is required!');
            return;
        }

        // Prompt user for runtime
        const runtimes: vscode.QuickPickItem[] = [
            { label: 'Node.js - 22' },
            { label: 'Node.js - 21.0' },
            { label: 'Node.js - 20.0' },
            { label: 'Node.js - 19.0' },
            { label: 'Node.js - 18.0' },
            { label: 'Node.js - 16.0' },
            { label: 'Node.js - 14.5' },
            { label: 'Python - 3.12' },
            { label: 'Python - 3.11' },
            { label: 'Python - 3.10' },
            { label: 'Python - 3.9' },
            { label: 'Python - 3.8' },
            { label: 'Dart - 3.5' },
            { label: 'Dart - 3.3' },
            { label: 'Dart - 3.1' },
            { label: 'Dart - 3.0' },
            { label: 'Dart - 2.19' },
            { label: 'Dart - 2.18' },
            { label: 'Dart - 2.17' },
            { label: 'Dart - 2.16' },
            { label: 'Go - 1.23' },
            { label: 'PHP - 8.3' },
            { label: 'PHP - 8.2' },
            { label: 'PHP - 8.1' },
            { label: 'PHP - 8.0' },
            { label: 'Deno - 2.0' },
            { label: 'Deno - 1.46' },
            { label: 'Deno - 1.40' },
            { label: 'Deno - 1.35' },
            { label: 'Deno - 1.24' },
            { label: 'Deno - 1.21' },
            { label: 'Bun - 1.1' },
            { label: 'Bun - 1.0' },
            { label: 'Ruby - 3.3' },
            { label: 'Ruby - 3.2' },
            { label: 'Ruby - 3.1' },
            { label: 'Ruby - 3.0'}
        ];

        const runtime = await vscode.window.showQuickPick(runtimes, { placeHolder: 'Select Runtime' }); 
        if (!runtime) { 
            vscode.window.showErrorMessage('Runtime is required!'); 
            return; 
        }

        // Create the function using Appwrite API
        const client = new AppwriteClient(context); 
        try { 
            await client.createFunction(functionName, runtime.label); 
            vscode.window.showInformationMessage(`Function ${functionName} created successfully!`); 
        } catch (err) { 
            const error = err as { message: string }; 
            vscode.window.showErrorMessage(`Failed to create function: ${error.message}`); 
        } 
    });

    // Register the deploy command
    const deployFunctionCommand = vscode.commands.registerCommand('extension.deployAppwriteFunction', async () => {
        // Get list of functions from Appwrite
        const client = new AppwriteClient(context);
        let functions: vscode.QuickPickItem[] = [];
        try {
            functions = await client.getFunctions();
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to retrieve functions: ${(error as Error).message}`);
            return;
        }

        // Prompt user to select a function
        const selectedFunction = await vscode.window.showQuickPick(functions, { placeHolder: 'Select function to deploy' });
        if (!selectedFunction) {
            vscode.window.showErrorMessage('Function selection is required!');
            return;
        }

        // Get the current content of the active editor as the function code
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found!');
            return;
        }
        const functionCode = editor.document.getText();

        // Deploy the function using Appwrite API
        try {
            await client.deployFunction(selectedFunction.label, functionCode);
            vscode.window.showInformationMessage(`Function ${selectedFunction.label} deployed successfully!`)
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to deploy function: ${(error as Error).message}`);
        }
    });

    // Add to subscriptions
    context.subscriptions.push(createFunctionCommand, deployFunctionCommand);
}