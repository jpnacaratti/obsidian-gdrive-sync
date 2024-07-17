import { DEFAULT_SETTINGS } from 'config/constants';
import { Plugin } from 'obsidian'
import { syncFilesAtEnd, syncFilesAtStart } from 'services/syncService';
import { currentSettings, loadSettings } from 'settings/gdriveSettings';
import { GDriveSyncSettingTab } from 'settings/gdriveSettingTab';

export default class GDriveSyncPlugin extends Plugin {
    private syncTimeout: number | null = null;

    async onload() {
        await loadSettings(this);

        this.addSettingTab(new GDriveSyncSettingTab(this.app, this));

        if (currentSettings.folderId == DEFAULT_SETTINGS.folderId) {
            console.log("onload: returning because folder id in settings is equal than the default")
            return;
        } 

        await syncFilesAtStart(this.app);

        this.startSyncJob();
    }

    onunload() {
        this.stopSyncJob();
    }

    startSyncJob() {
        console.log("Started Sync Job!")

        this.syncTimeout = window.setTimeout(() => {
            const syncAndScheduleNext = async () => {
                await syncFilesAtEnd(this.app);
                this.syncTimeout = window.setTimeout(syncAndScheduleNext, 60000);
            };
    
            syncAndScheduleNext();
        }, 60000);
    }

    stopSyncJob() {
        if (this.syncTimeout !== null) {
            clearTimeout(this.syncTimeout);
            this.syncTimeout = null;
        }
    }
}