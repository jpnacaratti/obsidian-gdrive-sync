import { GoogleAuth } from 'google-auth-library';
import { google } from 'googleapis';
import { App } from 'obsidian';
import { getPath, getMimeType } from './appUtils';
import { passDateToGoogleFormat } from './dateUtils';
import { createWriteStream, getDirectoryName, getFileStat, mkdirSync, readFile, toNodeReadable } from './fileUtils';
import { PLUGIN_FOLDER_NAME, SYNC_FILE_RELATIVE_PATH } from 'config/constants'
import { currentSettings } from 'settings/gdriveSettings';

export function authenticate(app: App) {
    const auth = new GoogleAuth({
        keyFile: `${getPath(app)}/.obsidian/plugins/${PLUGIN_FOLDER_NAME}/service_account.json`,
        scopes: 'https://www.googleapis.com/auth/drive',
    });

    return auth;
}

export async function uploadFile(auth: GoogleAuth, pathToFile: string, app: App, lastModifiedTime: null | string = null) {
    const service = google.drive({ version: 'v3', auth });
    
    const fileName = pathToFile.replace(`${getPath(app)!!}/`, '');

    const mimeType = getMimeType(pathToFile);

    try {

        const fileStat = await getFileStat(pathToFile);

        if (!fileStat) {
            console.error('File not found:', pathToFile);
            return;
        }

        if (!lastModifiedTime) {
            lastModifiedTime = passDateToGoogleFormat(new Date(fileStat.mtimeMs));
        }

        const fileData = await readFile(pathToFile);

        const requestBody = {
            name: fileName,
            modifiedTime: lastModifiedTime,
            parents: [currentSettings.folderId]
        };

        // Create an empty file in Google Drive Folder
        const createResponse = await service.files.create({
            requestBody,
            media: {
                ...(mimeType && { mimeType }),
                body: fileData,
            },
            fields: 'id',
        });

        const fileId = createResponse.data.id!!;

        // Put content inside the newly created empty file
        const updateResponse = await service.files.update({
            fileId: fileId,
            media: {
                ...(mimeType && { mimeType }),
                body: fileData,
            }
        });

        // Update the last modified time in newly created file
        const timeResponse = await service.files.update({
            fileId: fileId,
            requestBody: {
                modifiedTime: lastModifiedTime
            },
        });

        console.log('File uploaded successfully:', timeResponse.data.id);
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
}


export async function downloadCloudFile(destPath: string, fileId: string, auth: GoogleAuth): Promise<void> {
    const service = google.drive({ version: 'v3', auth });

    const dir = getDirectoryName(destPath);
    mkdirSync(dir);

    return new Promise((resolve, reject) => {
        service.files.get(
            {
                fileId: fileId,
                alt: 'media'
            },
            {
                responseType: 'stream'
            }
        ).then(res => {
            const dest = createWriteStream(destPath);

            toNodeReadable(res.data as any)
                .on('end', () => {
                    console.log('Done receiving file.');
                })
                .on('error', err => {
                    console.error('Error downloading file.', err);
                    reject(err);
                })
                .pipe(dest);

            dest.on('finish', () => {
                console.log('Done writing file.');
                resolve();
            });

        }).catch(err => {
            console.error('Error initiating download', err);
            reject(err);
        });
    });
}

export async function updateCloudFile(auth: GoogleAuth, pathToFile: string, fileId: string, lastModifiedTime: null | string = null) {
    const service = google.drive({ version: 'v3', auth });

    const mimeType = getMimeType(pathToFile);

    try {

        const fileStat = await getFileStat(pathToFile);

        if (!fileStat) {
            console.error('File not found:', pathToFile);
            return;
        }

        if (!lastModifiedTime) {
            lastModifiedTime = passDateToGoogleFormat(new Date(fileStat.mtimeMs));
        }

        const fileData = await readFile(pathToFile);

        // Put the new content inside file
        const updateResponse = await service.files.update({
            fileId: fileId,
            media: {
                ...(mimeType && { mimeType }),
                body: fileData,
            }
        });

        // Update the last modified time
        const timeResponse = await service.files.update({
            fileId: fileId,
            requestBody: {
                modifiedTime: lastModifiedTime
            },
        });

        console.log('File updated successfully:', timeResponse.data.id);
    } catch (err) {
        console.error('Error updating file:', err);
        throw err;
    }
}

export async function deleteCloudFile(auth: GoogleAuth, fileName: string, fileId: string) {
    const service = google.drive({ version: 'v3', auth });

    try {

        // Delete the file in the Google Drive Folder
        await service.files.delete({
            fileId: fileId
        });

    } catch(err) {
        console.log("Error when deleting file in Cloud:", fileName)
    }
}

export async function getCloudLastSyncDate(auth: GoogleAuth) {
    const service = google.drive({ version: 'v3', auth });

    try {
        const response = await service.files.list({
            fields: 'files(modifiedTime, id)',
            q: `'${currentSettings.folderId}' in parents and trashed=false and name='${SYNC_FILE_RELATIVE_PATH}'`
        });

        if (response.data.files?.length == 0) return null;
        else return {
            modifiedTime: response.data.files!![0].modifiedTime, 
            id: response.data.files!![0].id
        };
        
    } catch (err) {
        console.error('Error listing files:', err);
        throw err;
    }
}

export async function getCloudFiles(auth: GoogleAuth) {
    const service = google.drive({ version: 'v3', auth });

    try {

        const response = await service.files.list({
            fields: 'nextPageToken, files(modifiedTime, id, name)',
            q: `'${currentSettings.folderId}' in parents and trashed=false`
        });

        const toReturn = response.data.files;

        var nextPageToken = response.data.nextPageToken;

        while (nextPageToken) {
            const nextPageResponse = await service.files.list({
                pageToken: nextPageToken,
                fields: 'nextPageToken, files(modifiedTime, id, name)',
                q: `'${currentSettings.folderId}' in parents and trashed=false`
            });

            toReturn?.push.apply(toReturn, nextPageResponse.data.files);

            nextPageToken = nextPageResponse.data.nextPageToken;
        }

        return toReturn;
    } catch (err) {
        console.error('Error listing files:', err);
        throw err;
    }
}