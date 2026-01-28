/* eslint-disable @typescript-eslint/naming-convention */
import * as React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { RenderOptions, render } from '@testing-library/react'
import { DclThemeProvider, darkTheme } from 'decentraland-ui2'

type RenderWithProvidersOptions = RenderOptions & {
  initialEntries?: string[]
}

export function renderWithProviders(component: React.ReactElement, options?: RenderWithProvidersOptions) {
  const { initialEntries = ['/'], ...renderOptions } = options || {}

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <DclThemeProvider theme={darkTheme}>{children}</DclThemeProvider>
      </MemoryRouter>
    )
  }

  return render(component, { wrapper: Wrapper, ...renderOptions })
}
