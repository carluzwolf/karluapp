// Ajusta o projeto Android gerado: permissões de Bluetooth/microfone e ícones.
import { readFileSync, writeFileSync, cpSync, existsSync } from 'node:fs';

const MANIFEST = 'android/app/src/main/AndroidManifest.xml';
if (!existsSync(MANIFEST)) {
  console.error('Rode "npx cap add android" antes.');
  process.exit(1);
}

let m = readFileSync(MANIFEST, 'utf8');
if (!m.includes('xmlns:tools')) {
  m = m.replace('<manifest ', '<manifest xmlns:tools="http://schemas.android.com/tools" ');
}
if (!m.includes('BLUETOOTH_SCAN')) {
  const perms = `
    <!-- Bluetooth (Android 5 a 15) -->
    <uses-feature android:name="android.hardware.bluetooth_le" android:required="false" />
    <uses-permission android:name="android.permission.BLUETOOTH" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" android:maxSdkVersion="30" />
    <uses-permission android:name="android.permission.BLUETOOTH_SCAN" android:usesPermissionFlags="neverForLocation" tools:targetApi="s" />
    <uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
    <!-- Microfone (reação do Karlu ao som, na pré-visualização) -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
`;
  m = m.replace('</manifest>', perms + '</manifest>');
}
writeFileSync(MANIFEST, m);

// ícones do Karlu
if (existsSync('android-res')) cpSync('android-res', 'android/app/src/main/res', { recursive: true });
console.log('Android ajustado');
