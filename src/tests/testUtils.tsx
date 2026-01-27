import * as React from 'react'
import { RenderOptions, render } from '@testing-library/react'
import { DclThemeProvider, darkTheme } from 'decentraland-ui2'

export function renderWithProviders(component: React.ReactElement, options?: RenderOptions) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <DclThemeProvider theme={darkTheme}>{children}</DclThemeProvider>
  }

  return render(component, { wrapper: Wrapper, ...options })
}
