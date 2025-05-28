"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const ccpRunner_1 = require("./ccpRunner");
const fileSelector_1 = require("./fileSelector");
const ccpViewProvider_1 = require("./ccpViewProvider");
function activate(context) {
    // Create view providers
    const filesViewProvider = new ccpViewProvider_1.FilesViewProvider();
    const historyViewProvider = new ccpViewProvider_1.HistoryViewProvider();
    // Register tree data providers
    vscode.window.registerTreeDataProvider('ccpFiles', filesViewProvider);
    vscode.window.registerTreeDataProvider('ccpHistory', historyViewProvider);
    // Register command for single file processing
    let cleanCurrentFile = vscode.commands.registerCommand('ccp.cleanComments', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found.');
            return;
        }
        const document = editor.document;
        yield document.save();
        try {
            const backup = yield vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Create backup file?'
            });
            yield (0, ccpRunner_1.executeCcp)(document.fileName, backup === 'No', false);
            yield vscode.commands.executeCommand('workbench.action.files.revert');
            // Add to history
            historyViewProvider.addToHistory(document.fileName);
            vscode.window.showInformationMessage('Comments removed successfully!');
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error}`);
        }
    }));
    // Register command for batch file processing
    let cleanMultipleFiles = vscode.commands.registerCommand('ccp.cleanMultipleFiles', () => __awaiter(this, void 0, void 0, function* () {
        yield (0, fileSelector_1.selectAndProcessFiles)(historyViewProvider);
    }));
    context.subscriptions.push(cleanCurrentFile, cleanMultipleFiles);
}
function deactivate() { }
