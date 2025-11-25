import { renderHook } from "@testing-library/react"
import { useProfilePicture } from "./useProfilePicture"
import { useGetProfilePictureQuery } from "../features/profile/profile.client"

jest.mock("../features/profile/profile.client", () => ({
  useGetProfilePictureQuery: jest.fn(),
}))

const mockUseGetProfilePictureQuery =
  useGetProfilePictureQuery as jest.MockedFunction<
    typeof useGetProfilePictureQuery
  >

describe("when using the profile picture hook", () => {
  beforeEach(() => {
    mockUseGetProfilePictureQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      refetch: jest.fn(),
    } as ReturnType<typeof useGetProfilePictureQuery>)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("and the address is provided", () => {
    const address = "0x1234567890123456789012345678901234567890"

    it("should call the query hook with the address", () => {
      renderHook(() => useProfilePicture(address))

      expect(mockUseGetProfilePictureQuery).toHaveBeenCalledWith(address, {
        skip: false,
      })
    })

    describe("and data is available", () => {
      const profilePictureUrl = "https://example.com/profile.jpg"

      beforeEach(() => {
        mockUseGetProfilePictureQuery.mockReturnValue({
          data: profilePictureUrl,
          isLoading: false,
          isFetching: false,
          refetch: jest.fn(),
        } as ReturnType<typeof useGetProfilePictureQuery>)
      })

      it("should return the profile picture URL", () => {
        const { result } = renderHook(() => useProfilePicture(address))

        expect(result.current).toBe(profilePictureUrl)
      })
    })

    describe("and data is undefined", () => {
      beforeEach(() => {
        mockUseGetProfilePictureQuery.mockReturnValue({
          data: undefined,
          isLoading: false,
          isFetching: false,
          refetch: jest.fn(),
        } as ReturnType<typeof useGetProfilePictureQuery>)
      })

      it("should return empty string", () => {
        const { result } = renderHook(() => useProfilePicture(address))

        expect(result.current).toBe("")
      })
    })

    describe("and data is null", () => {
      beforeEach(() => {
        mockUseGetProfilePictureQuery.mockReturnValue({
          data: null,
          isLoading: false,
          isFetching: false,
          refetch: jest.fn(),
        } as ReturnType<typeof useGetProfilePictureQuery>)
      })

      it("should return empty string", () => {
        const { result } = renderHook(() => useProfilePicture(address))

        expect(result.current).toBe("")
      })
    })
  })

  describe("and the address is empty string", () => {
    it("should skip the query", () => {
      renderHook(() => useProfilePicture(""))

      expect(mockUseGetProfilePictureQuery).toHaveBeenCalledWith("", {
        skip: true,
      })
    })

    it("should return empty string", () => {
      const { result } = renderHook(() => useProfilePicture(""))

      expect(result.current).toBe("")
    })
  })
})
