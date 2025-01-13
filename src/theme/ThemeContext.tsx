import React, { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'

interface ThemeContextType {
  toggleColorMode: () => void
}

export const ThemeContext = createContext<ThemeContextType>({
  toggleColorMode: () => {},
})

export const useThemeContext = () => useContext(ThemeContext)

interface ThemeProviderWrapperProps {
  children: React.ReactNode
}

export const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    []
  )

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563eb',
            light: '#3b82f6',
            dark: '#1d4ed8',
          },
          ...(mode === 'dark'
            ? {
                background: {
                  default: '#111827',
                  paper: '#1f2937',
                },
                text: {
                  primary: '#f3f4f6',
                  secondary: '#d1d5db',
                },
              }
            : {
                background: {
                  default: '#f9fafb',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#111827',
                  secondary: '#4b5563',
                },
              }),
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 500,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
