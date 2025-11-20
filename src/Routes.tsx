import { Route, Routes } from "react-router-dom"
import { CommunityDetail } from "./components/Pages/CommunityDetail"
import { NotFound } from "./components/Pages/NotFound"
import { SignInRedirect } from "./components/Pages/SignInRedirect"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/communities/:id" element={<CommunityDetail />} />
      <Route path="/sign-in" element={<SignInRedirect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
