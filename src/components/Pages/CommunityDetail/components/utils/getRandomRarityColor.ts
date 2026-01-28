import type { Theme } from 'decentraland-ui2'

export const getRandomRarityColor = (theme: Theme) => {
  const paletteWithRarities = theme.palette
  const raritySource = paletteWithRarities.raritiesText ?? paletteWithRarities.rarities ?? {}
  const rarityColors = Object.values(raritySource).filter(Boolean)

  if (rarityColors.length === 0) {
    return theme.palette.secondary.main
  }

  return rarityColors[Math.floor(Math.random() * rarityColors.length)]
}
