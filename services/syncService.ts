import { App } from 'obsidian';
import { getPath } from 'utils/appUtils';
import { deleteFile, getLocalLastSyncDate, getObsidianFiles, setFileModificationTime, updateLocalSyncFile } from 'utils/fileUtils';
import { authenticate, deleteCloudFile, downloadCloudFile, getCloudFiles, getCloudLastSyncDate, updateCloudFile, uploadFile } from 'utils/googleDriveUtils';

const PLUGIN_FOLDER_NAME = 'xao-gdrive-sync';
const SYNC_FILE_RELATIVE_PATH = `.obsidian/plugins/${PLUGIN_FOLDER_NAME}/syncfile.json`

export async function syncFilesAtStart(app: App) {
    const basePath = getPath(app);

    if (!basePath) {
        console.log('Unable to get local base path');
        return;
    }

    const auth = authenticate(app);

    const cloudSyncDate = await getCloudLastSyncDate(auth);
    if (!cloudSyncDate) { // Google Drive Folder empty
        // TODO: Make this more safier, another type of search...
        console.log('SyncStart: Google Drive Folder empty, sending all...');
        syncFilesAtEnd(app);
        return;
    }

    const lastCloudSync = new Date(cloudSyncDate.modifiedTime!!);
    const lastLocalSync = new Date(await getLocalLastSyncDate(app, SYNC_FILE_RELATIVE_PATH));

    if (lastCloudSync <= lastLocalSync) {
        console.log('SyncStart: Unnecessary sync because local is newer than cloud, skipping...')
        return;
    }
    
    console.log('SyncStart: Cloud is newer than local, starting sync...')

    const localFiles = await getObsidianFiles(basePath, PLUGIN_FOLDER_NAME, app);
    console.log('Local Files:', localFiles);

    if (!localFiles) {
        console.log('SyncStart: Unable get local files')
        return;
    }

    const cloudFiles = await getCloudFiles(auth);
    console.log('Google Drive Files:', cloudFiles);

    if (!cloudFiles) {
        console.log('SyncStart: Unable get Google Drive files')
        return;
    }

    for (const element of cloudFiles) {
        if (!element.modifiedTime) {
            console.log('SyncStart: Invalid modifiedTime on Cloud File:', element.modifiedTime);
            continue;
        }

        if (!element.id) {
            console.log('SyncStart: Invalid id on Cloud File:', element.id);
            continue;
        }

        if (!element.name) {
            console.log('SyncStart: Invalid name on Cloud File:', element.name);
            continue;
        }

        if (element.name === SYNC_FILE_RELATIVE_PATH) {
            console.log('SyncStart: Downloading Sync File...');
            await downloadCloudFile(`${basePath}/${SYNC_FILE_RELATIVE_PATH}`, element.id, auth);
            continue;
        }

        const localElement = localFiles.filter(localFile => localFile.path === element.name).first();
        if (localElement) {
            if (!localElement.modifiedTime) {
                console.log('SyncStart: Invalid modifiedTime on Local File:', localElement.path);
                continue;
            }

            const cloudModifiedTime = new Date(element.modifiedTime);
            const localModifiedTime = new Date(localElement.modifiedTime);

            if (cloudModifiedTime <= localModifiedTime) continue;

            console.log('SyncStart: Found file newer in the Cloud:', element.name);
            await downloadCloudFile(`${basePath}/${element.name}`, element.id, auth);
            await setFileModificationTime(`${basePath}/${element.name}`, cloudModifiedTime);
        } else { 
            console.log('SyncStart: Found new file in the Cloud:', element.name);
            await downloadCloudFile(`${basePath}/${element.name}`, element.id, auth);
            await setFileModificationTime(`${basePath}/${element.name}`, new Date(element.modifiedTime));
        }
    }

    for (const localElement of localFiles) {
        const cloudElement = cloudFiles.filter(cloudFile => cloudFile.name === localElement.path).first();
        if (!cloudElement) {
            console.log('SyncStart: Found wrong file in Local, deleting:', localElement.path);
            await deleteFile(`${getPath(app)}/${localElement.path}`);
        }
    }
}


export async function syncFilesAtEnd(app: App): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            const basePath = getPath(app);

            if (!basePath) {
                console.log('Unable to get local base path');
                reject();
                return;
            }
    
            const auth = authenticate(app);
    
            const localFiles = await getObsidianFiles(basePath, PLUGIN_FOLDER_NAME, app);
            console.log('Local Files:', localFiles);
    
            if (!localFiles) {
                console.log('SyncEnd: Unable get local files')
                reject();
                return;
            }
    
            const cloudFiles = await getCloudFiles(auth);
            console.log('Google Drive Files:', cloudFiles);
    
            if (!cloudFiles) {
                console.log('SyncEnd: Unable get Google Drive files')
                reject();
                return;
            }

            for (const localElement of localFiles) {
                const element = cloudFiles.filter(cloudFile => cloudFile.name === localElement.path).first();
    
                if (element) { 
                    if (!element.modifiedTime) {
                        console.log('SyncEnd: Invalid modifiedTime on Cloud File:', element.modifiedTime);
                        continue;
                    }
        
                    if (!element.id) {
                        console.log('SyncEnd: Invalid id on Cloud File:', element.id);
                        continue;
                    }
        
                    if (!element.name) {
                        console.log('SyncEnd: Invalid name on Cloud File:', element.name);
                        continue;
                    }
        
                    if (!localElement.modifiedTime) {
                        console.log('SyncEnd: Invalid modifiedTime on Local File:', localElement.path);
                        continue;
                    }
    
                    const cloudModifiedTime = new Date(element.modifiedTime);
                    const localModifiedTime = new Date(localElement.modifiedTime);
    
                    if (localModifiedTime.getTime() == cloudModifiedTime.getTime()) continue;
    
                    if (localModifiedTime > cloudModifiedTime) {
                        console.log('SyncEnd: Found file newer in Local:', localElement.path);
                    } else if (localModifiedTime < cloudModifiedTime) {
                        console.log('SyncEnd: Found file newer in the Cloud, rollbacking it:', localElement.path);
                    }
                    
                    await updateCloudFile(auth, `${basePath}/${localElement.path}`, element.id);
                } else {
                    console.log('SyncEnd: Found new file in Local:', localElement.path);
                    await uploadFile(auth, `${basePath}/${localElement.path}`, app);
                }
            }
    
            for (const cloudElement of cloudFiles) {
                if (cloudElement.name === SYNC_FILE_RELATIVE_PATH) continue;
    
                const localElement = localFiles.filter(localFile => localFile.path === cloudElement.name).first();
                if (!localElement) {
                    console.log('SyncEnd: Found wrong file in Cloud, deleting:', cloudElement.name);
    
                    if (!cloudElement.name) {
                        console.log('SyncEnd: Invalid name on Cloud File:', cloudElement.name);
                        continue;
                    }
    
                    if (!cloudElement.id) {
                        console.log('SyncEnd: Invalid id on Cloud File:', cloudElement.id);
                        continue;
                    }
    
                    await deleteCloudFile(auth, cloudElement.name, cloudElement.id);
                }
            }
    
            console.log('Updating Sync File and sending to Cloud...');
            updateLocalSyncFile(app, SYNC_FILE_RELATIVE_PATH);
    
            const localLastSyncDate = await getLocalLastSyncDate(app, SYNC_FILE_RELATIVE_PATH);
    
            const cloudLastSyncDate = await getCloudLastSyncDate(auth);
            if (cloudLastSyncDate) {
                await updateCloudFile(auth, `${basePath}/${SYNC_FILE_RELATIVE_PATH}`, cloudLastSyncDate.id!!, localLastSyncDate);
            } else {
                await uploadFile(auth, `${basePath}/${SYNC_FILE_RELATIVE_PATH}`, localLastSyncDate);
            }

            resolve();
        } catch (err) {
            console.log('SyncEnd: Error on sync end file')
            reject();
        }
    });
}