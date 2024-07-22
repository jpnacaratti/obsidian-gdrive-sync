# Obsidian Google Drive Sync

Sync your Obsidian files with a Google Drive Folder efficiently.

## Installation

Primeiro de tudo, baixe a [release mais recente](https://github.com/jpnacaratti/obsidian-gdrive-sync/releases/latest).

Após finalizar o download do arquivo zip/tar.gz, extraia a pasta contida no arquivo para o diretório de plugins da sua vault do Obsidian. O caminho normalmente é: `.obsidian/plugins` (se a pasta `plugins` ainda não existir, crie-a vazia nesse diretório).

Você precisará de uma Service Account configurada no Google Cloud Platform e da API do Google Drive ativada. Há um passo a passo mais abaixo mostrando como realizar essas configurações.

Se você já possui o arquivo `.json` da Service Account, copie-o para a pasta do plugin e renomeie-o para `service_account.json`.

## Obtaining a Google Service Account and Activating Google Drive API

Para usar o plugin, é necessário ter uma service account no Google Cloud Platform e uma conta Google ativa.

O passo a passo a seguir demonstra como obter o arquivo da service account e configurá-lo no seu projeto. Também mostra como configurar sua conta do Google para permitir a sincronização.

1. Acesse [Google Cloud Console](https://console.cloud.google.com/), aceite os termos e condições, e clique em "Agree and Continue".

    <img src="https://i.imgur.com/BShcvhT.png" alt="First step" width="55%">

2. Clique no botão "Select a Project" no canto superior esquerdo da tela.

    <img src="https://i.imgur.com/ttNnQ9H.png" alt="Second step" width="55%">

3. Clique no botão "New Project" no canto superior direito da janela que acabou de abrir.
	
    <img src="https://i.imgur.com/jwG20BO.png" alt="Third step" width="55%">

4. Escolha um nome para o seu projeto (pode ser qualquer coisa) e clique em "Create".

    <img src="https://i.imgur.com/k1s1zo7.png" alt="Fourth step" width="55%">

5. Aguarde um pouco até o projeto ser criado e, quando estiver tudo ok, selecione o projeto.

    <img src="https://i.imgur.com/zH11Ehm.png" alt="Fifth step" width="55%">

6. Após o projeto ser selecionado e carregado, abra a aba de "Service Accounts".

    <img src="https://i.imgur.com/FS81jpm.png" alt="Sixth step" width="55%">

7. Clique em "Create Service Account".

    <img src="https://i.imgur.com/E36fwNC.png" alt="Seventh step" width="55%">

8. Uma nova janela irá abrir, preencha as informações dos campos e clique em "Conclude".

    <img src="https://i.imgur.com/tmXJ6BG.png" alt="Eighth step" width="55%">

9. Após criada, clique na Service Account.

    <img src="https://i.imgur.com/ailqqav.png" alt="Ninth step" width="55%">

10. Navegue até a aba de "Keys" e crie uma nova chave.

    <img src="https://i.imgur.com/VeDj1i4.png" alt="Tenth step" width="55%">

11. Selecione o formato JSON e clique em "Create".

    <img src="https://i.imgur.com/6zl8smh.png" alt="Eleventh step" width="55%">

12. Um arquivo .json será baixado, ele é o `service_account.json` que precisamos. Coloque esse arquivo no diretório do plugin e renomeie para `service_account.json`.

    <img src="https://i.imgur.com/YZyFXiP.png" alt="Twelfth step" width="55%">

13. Na barra de pesquisa superior, pesquise por "Google Drive API" e clique no primeiro link equivalente que aparecer.

    <img src="https://i.imgur.com/ubqxi8w.png" alt="Thirteenth step" width="55%">

14. Clique em "Enable" ou "Activate".

    <img src="https://i.imgur.com/DzbRnBe.png" alt="Fourteenth step" width="55%">

Pronto! Após todos esses *14* passos, você e sua conta do Google estão devidamente configuradas e prontas para sincronizar os arquivos.
