import { Navigate, Route, Routes } from "react-router-dom"
import { CommunityDetail } from "./components/Pages/CommunityDetail"
import { NotFound } from "./components/Pages/NotFound"
import { SignInPage } from "./components/Pages/SignInPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/communities/:id" element={<CommunityDetail />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
