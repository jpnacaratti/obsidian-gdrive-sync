import { promises as fs } from 'fs';
import { Readable } from 'stream';
import * as fileSystem from 'fs';
import * as path from 'path';
import { App } from 'obsidian';
import { getPath } from './appUtils';
import { passDateToGoogleFormat } from './dateUtils';

export async function getFileStat(filePath: string) {
    return fs.stat(filePath);
}

export async function readFile(filePath: string) {
    return fs.readFile(filePath);
}

export async function writeFile(filePath: string, data: string) {
    return fs.writeFile(filePath, data, 'utf-8');
}

export function createWriteStream(filePath: string) {
    return fileSystem.createWriteStream(filePath);
}

export function createReadStream(filePath: string) {
    return fileSystem.createReadStream(filePath);
}

export function mkdirSync(dir: string) {
    return fileSystem.mkdirSync(dir, { recursive: true });
}

export function getFilePath(dir: string, fileName: string) {
    return path.join(dir, fileName);
}

export function getDirectoryName(filePath: string) {
    return path.dirname(filePath);
}

// Transforms a web ReadableStream to Node.js Readable (by: StackOverFlow)
export function toNodeReadable(webStream: ReadableStream) {
    const reader = webStream.getReader();
    const rs = new Readable();

    rs._read = async () => {
        const result = await reader.read();

        if (!result.done) {
            rs.push(Buffer.from(result.value));
        } else {
            rs.push(null);
        }
    };
    return rs;
}

export async function getLocalLastSyncDate(app: App, syncFileRelativePath: string) {
    const filePath = `${getPath(app)}/${syncFileRelativePath}`;

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        const jsonData = JSON.parse(fileContent);
        
        const editDate = jsonData.lastEditDate;
        
        return editDate;
    } catch (err) {
        console.error(`Error reading or parsing Local Last Sync Date: `, err);
    }
}

export async function updateLocalSyncFile(app: App, syncFileRelativePath: string) {
    const filePath = `${getPath(app)}/${syncFileRelativePath}`;
    
    const data = {
        lastEditDate: passDateToGoogleFormat(new Date(Date.now()))
    };
    
    try {
        const jsonData = JSON.stringify(data, null, 2);

        await fs.writeFile(filePath, jsonData, 'utf-8');
        console.log(`Sync File updated`);
        
    } catch (err) {
        console.log(`Error updating the Local Sync File: `, err)
    }
}

export async function setFileModificationTime(filePath: string, modTime: Date) {
    try {
        const timeInSeconds = modTime.getTime() / 1000;

        const stats = await fs.stat(filePath);
        const atime = stats.atime.getTime() / 1000;

        await fs.utimes(filePath, atime, timeInSeconds);

        console.log(`Updated Last Modified Time of ${filePath} with success`);
    } catch (err) {
        console.error(`Error when updating Last Modified Time: `, err);
        throw err;
    }
}

export async function deleteFile(filePath: string) {
    try {
        await fs.unlink(filePath);
        console.log(`File ${filePath} successfully deleted.`);
    } catch (err) {
        console.error(`Error when delete file: `, err);
        throw err;
    }
}

export async function getObsidianFiles(dirPath: string, pluginFolderName: string, app: App) {
    let filePaths: { path: string, modifiedTime: string }[] = [];

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name === pluginFolderName) continue;

            const fullPath = path.join(dirPath, entry.name);

            const fileStat = await fs.stat(fullPath);
            const lastModifiedTime = passDateToGoogleFormat(new Date(fileStat.mtimeMs));
            
            if (entry.isDirectory()) {
                const subDirFiles = await getObsidianFiles(fullPath, pluginFolderName, app);
                filePaths = filePaths.concat(subDirFiles);
            } else {
                const normalizedPath = fullPath.replace(/\\/g, "/");
                filePaths.push({ path: normalizedPath.replace(`${getPath(app)!!.replace(/\\/g, "/")}/`, ''), modifiedTime: lastModifiedTime });
            }
        }
    } catch (err) {
        console.error(`Unable to scan directory: `, err);
    }
    return filePaths;
}