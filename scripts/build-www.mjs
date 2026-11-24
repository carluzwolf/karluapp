// Monta a pasta www/ (o que vai dentro do APK) a partir de site/.
import { cpSync, rmSync, mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { build } from 'esbuild';

const SITE = 'site', OUT = 'www';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync(SITE, OUT, { recursive: true });

// 1) o app não precisa de service worker, README, sitemap etc.
for (const f of ['js/sw.js', 'robots.txt', 'sitemap.xml', 'vercel.json', 'README.md']) {
  rmSync(join(OUT, f), { force: true });
}

// 2) ponte Bluetooth (bundle com o plugin nativo)
await build({
  entryPoints: ['src/bt-native.js'],
  bundle: true, minify: true, format: 'iife', target: 'chrome90',
  outfile: join(OUT, 'js/bt-native.js'),
});

// 3) a página inicial do app é a tela de configurar
if (existsSync(join(OUT, 'index.html'))) {
  cpSync(join(OUT, 'index.html'), join(OUT, 'site-inicio.html'));
}
writeFileSync(join(OUT, 'index.html'),
  '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
  '<meta http-equiv="refresh" content="0;url=configurar.html">' +
  '<script>location.replace("configurar.html")</script></head><body></body></html>');

// 4) injeta a ponte antes de qualquer outro script, em todas as páginas
const TAG = '<script src="js/bt-native.js"></script>';
for (const f of readdirSync(OUT).filter((n) => n.endsWith('.html') && n !== 'index.html')) {
  const p = join(OUT, f);
  let h = readFileSync(p, 'utf8');
  if (!h.includes('bt-native.js')) h = h.replace('</head>', TAG + '\n</head>');
  writeFileSync(p, h);
}
console.log('www/ pronto');
