import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import presetPxToVw from 'unocss-preset-px-to-vw'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'

export default defineConfig({
  shortcuts: [],
  theme: {
    colors: {
      primary: '#3ba8ff',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      collections: {
        epinbao: FileSystemIconLoader('./src/assets/svg', (svg) =>
          svg.replace(/#fff/, 'currentColor'),
        ),
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
    presetPxToVw({ viewportWidth: 1080 }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
