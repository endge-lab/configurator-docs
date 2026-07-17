# Nova Assets v2

Nova Assets v2 добавляет единый lifecycle для визуальных ресурсов: gradients, patterns, procedural textures, nine-slice images и fonts. Ресурсы можно объявлять через `Nova.assets` в TypeScript или через `<Nova.Assets>` внутри `.nova`.

## Fill assets

Fill assets используются в `rect.styles.background`. Процедурные gradients, `noise` и `meshGradient` создают canvas один раз и дальше работают одинаково в Canvas2D и WebGL.

```ts
const assets = Nova.assets.define('brand', {
  fills: {
    radial: Nova.assets.radialGradient({ inner: '#fff', outer: '#2563eb', size: 512 }),
    conic: Nova.assets.conicGradient({ from: '#22c55e', to: '#22c55e', stops }),
    pattern: Nova.assets.pattern(tileCanvas, { repeat: 'repeat', width: 40, height: 40 }),
    noise: Nova.assets.noise({ baseColor: '#f8fafc', noiseColor: '#0f172a', opacity: 0.16 }),
    mesh: Nova.assets.meshGradient({ background: '#eff6ff', points }),
  },
})
```

`stripe` и `pattern` по умолчанию имеют `fillMode: repeat`. Gradients, `noise` и `meshGradient` имеют `fillMode: stretch`, поэтому широкие rect больше не повторяют gradient как tile.

## DSL declarations

```vue
<Nova.Assets>
  <Nova.RadialGradient id="spot" inner="#fff" outer="#2563eb" />
  <Nova.ConicGradient id="wheel" from="#22c55e" to="#22c55e" :stops="wheelStops" />
  <Nova.Pattern id="tile" src="../assets/tile.png" repeat="repeat" />
  <Nova.Noise id="grain" base-color="#f8fafc" noise-color="#0f172a" :opacity="0.16" />
  <Nova.MeshGradient id="mesh" background="#eff6ff" :points="meshPoints" />
  <Nova.NineSliceImage id="panel" src="../assets/panel.png" :slice="16" />
  <Nova.Font id="display" family="Nova Display" src="../assets/NovaDisplay.woff2" weight="700" />
</Nova.Assets>
```

Compiler регистрирует declarations как scoped bundle компонента и снимает их при `dispose()`.

## Nine-slice images

Nine-slice image не используется как `rect.background`. Это отдельный schema primitive, потому что renderer должен знать slice metadata:

```ts
schema.push({
  type: 'nine-slice-image',
  x: 24,
  y: 24,
  width: 320,
  height: 120,
  image: assets.images.panel,
})
```

Canvas2D рисует nine-slice через девять `drawImage` calls. WebGL рендерит те же девять областей как textured quads.

## Fonts

`Nova.assets.font` отвечает только за загрузку и регистрацию шрифта. Text schema продолжает использовать обычный `font.family`.

```ts
const assets = Nova.assets.define('fonts', {
  fonts: {
    display: Nova.assets.font({ family: 'Nova Display', src: '/fonts/NovaDisplay.woff2', weight: '700' }),
  },
})
```

После регистрации можно использовать `font: { family: 'Nova Display, Inter, sans-serif' }`. При `unuse` registry удаляет `FontFace`, если bundle больше не используется.
