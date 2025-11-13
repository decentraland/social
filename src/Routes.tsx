import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { usePageTracking } from 'decentraland-dapps/dist/hooks/usePageTracking'
import CommunitiesLanding from './components/Pages/CommunitiesLanding'
import SignInPage from './components/Pages/SignInPage'

export default function AppRoutes() {
  usePageTracking()

  return (
    <Routes>
      <Route path="/" element={<CommunitiesLanding />} />
      <Route path="/sign-in" element={<SignInPage />} />
    </Routes>
  )
}

