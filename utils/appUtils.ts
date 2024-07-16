import * as path from 'path';
import { App, FileSystemAdapter } from 'obsidian';

export function getPath(app: App) {
    let adapter = app.vault.adapter;
    if (adapter instanceof FileSystemAdapter) {
        return adapter.getBasePath();
    }
    return null;
}

export function getMimeType(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.md': return 'text/markdown';
        case '.jpg': return 'image/jpeg';
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.gif': return 'image/gif';
        default: return null;
    }
}