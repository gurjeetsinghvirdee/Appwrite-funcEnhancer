import * as vscode from 'vscode';
import axios from 'axios';

export class AppwriteClient {
    private endpoint: string;
    private projectId: string;
    private apiKey: string;

    constructor(context: vscode.ExtensionContext) {
        this.endpoint = 'https://cloud.appwrite.io/v1';
        this.projectId = context.globalState.get('appwriteProjectId', '');
        this.apiKey = context.globalState.get('appwriteApiKey', '');
    }

    public async createFunction(name: string, runtime: string): Promise<void> {
        const url = `${this.endpoint}/functions`;
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

    public async getFunctions(): Promise<vscode.QuickPickItem[]> {
        const url = `${this.endpoint}/functions`;
        const response = await axios.get(url, {
            headers: {
                'X-Appwrite-Project': this.projectId,
                'X-Appwrite-Key': this.apiKey,
            }
        });

        if (response.status !== 200) {
            throw new Error(`Error retrieving functions: ${response.statusText}`);
        }

        return response.data.functions.map((func: any) => ({
            label: func.name,
            description: func.runtime
        }));
    }

    public async deployFunction(name: string, code: string): Promise<void> {
        const url = `${this.endpoint}/functions/${name}/deployments`;
        const response = await axios.post(url, {
            code,
        }, {
            headers: {
                'X-Appwrite-Project': this.projectId,
                'X-Appwrite-Key': this.apiKey,
            }
        });

        if (response.status !== 201) {
            throw new Error(`Error deploying function: ${response.statusText}`);
        }
    }
}