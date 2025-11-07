/**
 * Script pour générer les splash screens iOS
 * Usage: pnpm tsx scripts/generate-splash-screens.ts
 */

import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { existsSync } from 'fs'

const SPLASH_SIZES = [
  { name: 'iphone6', width: 750, height: 1334, description: 'iPhone 6/7/8' },
  { name: 'iphone12', width: 1170, height: 2532, description: 'iPhone 12/13/14' },
  { name: 'iphone14pro', width: 1179, height: 2556, description: 'iPhone 14 Pro' },
  { name: 'ipad', width: 1536, height: 2048, description: 'iPad' },
]

const SOURCE_LOGO = 'public/logo.svg'
const FALLBACK_LOGO = 'public/icon-512.png'
const BACKGROUND_COLOR = { r: 10, g: 15, b: 41, alpha: 1 } // Navy

async function generateSplashScreens() {
  try {
    // Créer le dossier splash
    await mkdir('public/splash', { recursive: true })

    // Vérifier si le logo existe
    let logoSource = SOURCE_LOGO
    if (!existsSync(SOURCE_LOGO)) {
      console.warn(`⚠️  ${SOURCE_LOGO} not found, using fallback: ${FALLBACK_LOGO}`)
      if (!existsSync(FALLBACK_LOGO)) {
        console.error('❌ No logo found. Please run generate:icons first.')
        process.exit(1)
      }
      logoSource = FALLBACK_LOGO
    }

    console.log(`📱 Generating iOS splash screens from ${logoSource}...\n`)

    for (const size of SPLASH_SIZES) {
      // Créer le background navy
      const background = await sharp({
        create: {
          width: size.width,
          height: size.height,
          channels: 4,
          background: BACKGROUND_COLOR,
        },
      }).png().toBuffer()

      // Calculer la taille du logo (max 50% de la largeur, max 400px)
      const logoSize = Math.min(size.width * 0.5, 400)

      // Redimensionner le logo
      const logo = await sharp(logoSource)
        .resize(Math.floor(logoSize))
        .png()
        .toBuffer()

      // Composer l'image finale
      const outputPath = `public/splash/${size.name}.png`
      await sharp(background)
        .composite([{
          input: logo,
          gravity: 'center',
        }])
        .png()
        .toFile(outputPath)

      console.log(`✅ Generated splash/${size.name}.png (${size.width}x${size.height}px) - ${size.description}`)
    }

    console.log('\n🎉 All splash screens generated successfully!')
    console.log('\n📝 Files created in public/splash/')
  } catch (error) {
    console.error('❌ Error generating splash screens:', error)
    process.exit(1)
  }
}

generateSplashScreens()
