import type { Theme } from "@mui/material/styles"

export const getRandomRarityColor = (theme: Theme) => {
  const paletteWithRarities = theme.palette as Theme["palette"] & {
    rarities?: Record<string, string>
    raritiesText?: Record<string, string>
  }
  const raritySource =
    paletteWithRarities.raritiesText ?? paletteWithRarities.rarities ?? {}
  const rarityColors = Object.values(raritySource).filter(Boolean)

  if (rarityColors.length === 0) {
    return theme.palette.secondary.main
  }

  return rarityColors[Math.floor(Math.random() * rarityColors.length)]
}
