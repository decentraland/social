import { Route, Routes } from "react-router-dom"
import { ConnectAndRedirect } from "./components/HOC/ConnectAndRedirect"
import { CommunityDetail } from "./components/Pages/CommunityDetail"
import { SignInPage } from "./components/Pages/SignInPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/communities/:id" element={<CommunityDetail />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="*" element={<ConnectAndRedirect />} />
    </Routes>
  )
}
