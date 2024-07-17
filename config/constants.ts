import { PluginSettings } from "settings/gdriveSettings";

export const PLUGIN_FOLDER_NAME = 'obsidian-gdrive-sync';
export const SYNC_FILE_RELATIVE_PATH = `.obsidian/plugins/${PLUGIN_FOLDER_NAME}/syncfile.json`

export const DEFAULT_SETTINGS: Partial<PluginSettings> = {
    folderId: '1GH0Ww6FvVnKhqrOmwjlLl-Ej91aJODKl'
};