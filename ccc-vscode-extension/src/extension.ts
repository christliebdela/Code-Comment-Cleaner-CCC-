import * as vscode from 'vscode';
import { executeCcp } from './ccpRunner';
import { selectAndProcessFiles } from './fileSelector';

export function activate(context: vscode.ExtensionContext) {
    // Register command for single file processing
    let cleanCurrentFile = vscode.commands.registerCommand('ccp.cleanComments', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }

        const document = editor.document;
        await document.save();
        
        try {
            const backup = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Create backup file?'
            });
            
            await executeCcp(document.fileName, backup === 'No', false);
            await vscode.commands.executeCommand('workbench.action.files.revert');
            
            vscode.window.showInformationMessage('Comments removed successfully!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    });

    // Register command for batch file processing
    let cleanMultipleFiles = vscode.commands.registerCommand('ccp.cleanMultipleFiles', async () => {
        await selectAndProcessFiles();
    });

    context.subscriptions.push(cleanCurrentFile, cleanMultipleFiles);
}

export function deactivate() {}