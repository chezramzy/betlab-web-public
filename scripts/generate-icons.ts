/**
 * Script pour générer les icônes PWA à partir d'une source
 * Usage: pnpm tsx scripts/generate-icons.ts
 */

import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const ICON_SIZES = [16, 32, 192, 512, 180] // 180 pour Apple Touch Icon
const SOURCE_ICON = 'public/logo.svg' // Changez selon votre logo source
const FALLBACK_ICON = 'public/next.svg'

// Couleur de fond Navy de BetLab
const BACKGROUND_COLOR = { r: 10, g: 15, b: 41, alpha: 1 }

async function generateIcons() {
  try {
    // Vérifier si le source existe
    let iconSource = SOURCE_ICON
    if (!existsSync(SOURCE_ICON)) {
      console.warn(`⚠️  ${SOURCE_ICON} not found, using fallback: ${FALLBACK_ICON}`)
      iconSource = FALLBACK_ICON
    }

    console.log(`📦 Generating PWA icons from ${iconSource}...\n`)

    for (const size of ICON_SIZES) {
      const filename = size === 180 ? 'icon-apple-touch.png' : `icon-${size}.png`
      const outputPath = `public/${filename}`

      await sharp(iconSource)
        .resize(size, size, {
          fit: 'contain',
          background: BACKGROUND_COLOR,
        })
        .png()
        .toFile(outputPath)

      console.log(`✅ Generated ${filename} (${size}x${size}px)`)
    }

    console.log('\n🎉 All icons generated successfully!')
    console.log('\n📝 Next steps:')
    console.log('   1. Replace the generated icons with your actual logo')
    console.log('   2. Run: pnpm generate:splash to create splash screens')
  } catch (error) {
    console.error('❌ Error generating icons:', error)
    process.exit(1)
  }
}

generateIcons()
