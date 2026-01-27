import { Route, Switch } from "react-router-dom"
import { CommunityDetail } from "./components/Pages/CommunityDetail"
import { NotFound } from "./components/Pages/NotFound"
import { SignInRedirect } from "./components/Pages/SignInRedirect"

export function AppRoutes() {
  return (
    <Switch>
      <Route path="/communities/:id" component={CommunityDetail} />
      <Route path="/sign-in" component={SignInRedirect} />
      <Route component={NotFound} />
    </Switch>
  )
}
