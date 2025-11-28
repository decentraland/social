import { Theme } from "decentraland-ui2"
import { getRandomRarityColor } from "./getRandomRarityColor"

describe("getRandomRarityColor", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("returns a color from raritiesText when available", () => {
    const theme = {
      palette: {
        secondary: { main: "#000000" },
        raritiesText: {
          epic: "#FFA500",
          legendary: "#800080",
        },
      },
    } as unknown as Theme

    jest.spyOn(Math, "random").mockReturnValue(0)

    expect(getRandomRarityColor(theme)).toBe("#FFA500")
  })

  it("falls back to rarities when raritiesText is missing", () => {
    const theme = {
      palette: {
        secondary: { main: "#000000" },
        rarities: {
          rare: "#00FF00",
        },
      },
    } as unknown as Theme

    jest.spyOn(Math, "random").mockReturnValue(0.5)

    expect(getRandomRarityColor(theme)).toBe("#00FF00")
  })

  it("returns the secondary main color when no rarities are configured", () => {
    const theme = {
      palette: {
        secondary: { main: "#ABCDEF" },
      },
    } as Theme

    expect(getRandomRarityColor(theme)).toBe("#ABCDEF")
  })
})
