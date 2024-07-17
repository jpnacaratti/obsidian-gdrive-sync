import { DEFAULT_SETTINGS } from "config/constants";
import { Plugin } from "obsidian";

export interface PluginSettings {
    folderId: string;
}

export let currentSettings: PluginSettings = { ...DEFAULT_SETTINGS } as PluginSettings;

export async function loadSettings(plugin: Plugin) {
    currentSettings = Object.assign({}, DEFAULT_SETTINGS, await plugin.loadData());
}

export async function saveSettings(plugin: Plugin) {
    await plugin.saveData(currentSettings);
}

export function updateSettings(newFolderId: string) {
    currentSettings.folderId = newFolderId;
}