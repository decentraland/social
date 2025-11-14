export const locations = {
  root: () => "/",
  community: (communityId: string) => `/communities/${communityId}}`,
  signIn: (redirectTo?: string) =>
    `/sign-in${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
}
