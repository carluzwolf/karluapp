# Karlu — app Android (APK de verdade)

App nativo (Capacitor) que carrega as páginas do site (Configurar, Criar rosto, Reações, Olhares...) dentro do app
e usa o **Bluetooth nativo do Android** para falar com o Karlu. Não é atalho do Chrome.

## Como gerar o APK (sem instalar nada no PC)

1. Crie um repositório no GitHub (pode ser privado) e suba **todo o conteúdo desta pasta** (inclusive a pasta oculta `.github`).
2. Abra a aba **Actions** > **Gerar APK do Karlu** > **Run workflow** (também roda sozinho a cada push).
3. Espere uns 5 a 10 minutos. Na execução concluída, em **Artifacts**, baixe **Karlu-APK** (vem um .zip com o `Karlu.apk`).
4. Passe o `Karlu.apk` pro celular, abra e permita "instalar apps desconhecidos". Ao abrir o app, aceite as permissões de Bluetooth.

## Estrutura
- `site/` — o seu site (edite aqui; o app usa estes arquivos).
- `src/bt-native.js` — ponte que faz o `navigator.bluetooth` do site funcionar no app.
- `scripts/` — monta o app e ajusta permissões/ícones.
- `android-res/` — ícones do Karlu.
- `.github/workflows/build-apk.yml` — compila o APK na nuvem.

## Atualizar o app
Mude os arquivos em `site/`, suba pro GitHub e baixe o novo APK em Actions. Instale por cima do anterior.

## Gerar no seu PC (opcional)
Precisa de Node 22, JDK 21 e Android SDK:
```
npm install
npm run build:web
npx cap add android
npx cap sync android
node scripts/patch-android.mjs
cd android && ./gradlew assembleDebug
```
O APK fica em `android/app/build/outputs/apk/debug/app-debug.apk`.

## Observações
- O APK é "debug": instala direto, mas não serve para a Play Store. Para publicar lá é preciso assinar um release com keystore.
- Só Android. iPhone exige Mac + conta Apple Developer.
- Botões de Foto/Clipe podem se comportar diferente no app (dependem de compartilhar/baixar arquivo pelo WebView).
