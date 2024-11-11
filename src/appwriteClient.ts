import * as vscode from 'vscode';
import axios from 'axios';

export class AppwriteClient {
    private endpoint: string;
    private projectId: string;
    private apiKey: string;

    constructor(context: vscode.ExtensionContext) {
        this.endpoint = context.globalState.get('appwriteEndpoint', '');
        this.projectId = context.globalState.get('appwriteProjectId', '');
        this.apiKey = context.globalState.get('appwriteApiKey', '');
    }

    public async createFunction(name: string, runtime: string): Promise<void> {
        const url = `${this.endpoint}/v1/functions`;
        const response = await axios.post(url, {
            name,
            runtime,
            projectId: this.projectId,
        }, {
            headers: {
                'X-Appwrite-Project': this.projectId,
                'X-Appwrite-Key': this.apiKey,
            }
        });

        if (response.status !== 201) {
            throw new Error(`Error creating function: ${response.statusText}`);
        }
    }
}