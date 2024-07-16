import { Plugin } from 'obsidian'
import { syncFilesAtEnd, syncFilesAtStart } from 'services/syncService';

export default class GDriveSyncPlugin extends Plugin {

    async onload() {
        await syncFilesAtStart(this.app);

        setTimeout(() => {
            this.startSyncJob();
        }, 60000);
    }

    startSyncJob(): void {
        const syncAndScheduleNext = async () => {
            await syncFilesAtEnd(this.app);
            setTimeout(syncAndScheduleNext, 60000);
        };

        syncAndScheduleNext();
    }
}