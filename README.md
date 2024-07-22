# Obsidian Google Drive Sync

Sync your Obsidian files with a Google Drive Folder efficiently.

## Installation

First, download the [latest release](https://github.com/jpnacaratti/obsidian-gdrive-sync/releases/latest).

After finishing the download of the zip/tar.gz file, extract the folder contained in the file to the plugins directory of your Obsidian vault. The path is usually: `.obsidian/plugins` (if the `plugins` folder does not exist yet, create it in this directory).

You will need a Service Account configured on the Google Cloud Platform and the Google Drive API activated. If you don't have this set up, follow the [step-by-step guide](https://github.com/jpnacaratti/obsidian-gdrive-sync/edit/develop/README.md#obtaining-a-google-service-account-and-activating-google-drive-api).

If you already have the `.json` file for the Service Account, copy it to the plugin's folder and rename it to `service_account.json`.

## Configuration

With everything set up, open Obsidian and go to the plugin's configuration screen. There, you will find a field to enter the `ID` of your Google Drive folder. Just copy the `ID` from the URL in your browser and paste it into this field.

The `ID` should be entered in a manner similar to this:

<img src="https://i.imgur.com/09eqeek.png" alt="Example of folder ID input" width="75%">

After entering the correct `ID`, the files will start syncing as follows: every 1 minute, all modified files will be sent to the cloud.

Best practices:
- Perform regular backups.
- When about to close Obsidian, wait at least 1 minute to ensure all files are synced.
- If you use Obsidian without internet, wait for a stable connection, ensure the old files are synced, and only then open your Obsidian on another computer.

**Note:** It is strictly necessary that the created Google Drive folder is **PUBLIC** and with **FREE EDIT ACCESS**.

## Obtaining a Google Service Account and Activating Google Drive API

To use the plugin, you need a service account on the Google Cloud Platform and an active Google account.

The following step-by-step guide shows how to obtain the service account file and configure it in your project. It also shows how to set up your Google account to allow synchronization.

1. Access [Google Cloud Console](https://console.cloud.google.com/), accept the terms and conditions, and click "Agree and Continue".

    <img src="https://i.imgur.com/BShcvhT.png" alt="First step" width="55%">

2. Click the "Select a Project" button in the top left corner of the screen.

    <img src="https://i.imgur.com/ttNnQ9H.png" alt="Second step" width="55%">

3. Click the "New Project" button in the top right corner of the window that just opened.

    <img src="https://i.imgur.com/jwG20BO.png" alt="Third step" width="55%">

4. Choose a name for your project (it can be anything) and click "Create".

    <img src="https://i.imgur.com/k1s1zo7.png" alt="Fourth step" width="55%">

5. Wait a moment for the project to be created and, when it's ready, select the project.

    <img src="https://i.imgur.com/zH11Ehm.png" alt="Fifth step" width="55%">

6. After the project is selected and loaded, open the "Service Accounts" tab.

    <img src="https://i.imgur.com/FS81jpm.png" alt="Sixth step" width="55%">

7. Click on "Create Service Account".

    <img src="https://i.imgur.com/E36fwNC.png" alt="Seventh step" width="55%">

8. A new window will open, fill in the required fields and click "Conclude".

    <img src="https://i.imgur.com/tmXJ6BG.png" alt="Eighth step" width="55%">

9. Once created, click on the Service Account.

    <img src="https://i.imgur.com/ailqqav.png" alt="Ninth step" width="55%">

10. Navigate to the "Keys" tab and create a new key.

    <img src="https://i.imgur.com/VeDj1i4.png" alt="Tenth step" width="55%">

11. Select the JSON format and click "Create".

    <img src="https://i.imgur.com/6zl8smh.png" alt="Eleventh step" width="55%">

12. A .json file will be downloaded, this is the `service_account.json` we need. Place this file in the plugin's directory and rename it to `service_account.json`.

    <img src="https://i.imgur.com/YZyFXiP.png" alt="Twelfth step" width="55%">

13. In the top search bar, search for "Google Drive API" and click on the first relevant link that appears.

    <img src="https://i.imgur.com/ubqxi8w.png" alt="Thirteenth step" width="55%">

14. Click on "Enable" or "Activate".

    <img src="https://i.imgur.com/DzbRnBe.png" alt="Fourteenth step" width="55%">

Done! After completing these **14** steps, your Google account is properly configured and ready to sync files.
