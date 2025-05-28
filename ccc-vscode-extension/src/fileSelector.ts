import * as vscode from 'vscode';
import { executeCcp } from './ccpRunner';

export async function selectAndProcessFiles(): Promise<void> {
    // Get pattern from user
    const pattern = await vscode.window.showInputBox({
        placeHolder: 'File pattern (e.g., *.js, src/**/*.py)',
        prompt: 'Enter a glob pattern to match files'
    });
    
    if (!pattern) {
        return;
    }
    
    // Create options
    const noBackup = await vscode.window.showQuickPick(['Create Backups', 'No Backups'], {
        placeHolder: 'Should backups be created?'
    }) === 'No Backups';
    
    const force = await vscode.window.showQuickPick(['Skip Unknown Files', 'Force Process All Files'], {
        placeHolder: 'How to handle unknown file types?'
    }) === 'Force Process All Files';
    
    const recursive = pattern.includes('**') || await vscode.window.showQuickPick(['Non-Recursive', 'Recursive'], {
        placeHolder: 'Process files in subdirectories?'
    }) === 'Recursive';
    
    // Find files matching the pattern
    const files = await vscode.workspace.findFiles(pattern);
    
    if (files.length === 0) {
        vscode.window.showWarningMessage(`No files found matching pattern: ${pattern}`);
        return;
    }
    
    // Confirm with user
    const proceed = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: `Process ${files.length} files?`
    });
    
    if (proceed !== 'Yes') {
        return;
    }
    
    // Process each file
    const progress = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Removing comments from ${files.length} files`,
        cancellable: true
    }, async (progress, token) => {
        let processed = 0;
        
        for (const file of files) {
            if (token.isCancellationRequested) {
                break;
            }
            
            try {
                await executeCcp(file.fsPath, noBackup, force);
                processed++;
                progress.report({ 
                    increment: 100 / files.length,
                    message: `${processed}/${files.length} files processed`
                });
            } catch (error) {
                console.error(`Error processing ${file.fsPath}:`, error);
            }
        }
        
        return processed;
    });
    
    vscode.window.showInformationMessage(`Successfully processed ${progress} of ${files.length} files`);
}