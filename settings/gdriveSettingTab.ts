import GDriveSyncPlugin from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { currentSettings, saveSettings, updateSettings } from "./gdriveSettings";
import { syncFilesAtStart } from "services/syncService";

export class GDriveSyncSettingTab extends PluginSettingTab {
    plugin: GDriveSyncPlugin;

    constructor(app: App, plugin: GDriveSyncPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl).
        setName('Folder ID').
        setDesc('Google Drive folder ID').
        addText((text) => {
            text.setPlaceholder('Put your Google Drive folder ID here').
            setValue(currentSettings.folderId).
            onChange(async (value) => {
                updateSettings(value);

                this.plugin.stopSyncJob();

                await syncFilesAtStart(this.plugin.app);

                this.plugin.startSyncJob();

                await saveSettings(this.plugin);
            })
            
            text.inputEl.classList.add('gdrive-folder-id-input');
        })
    }
}