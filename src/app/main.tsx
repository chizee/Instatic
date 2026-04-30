import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { TooltipProvider } from '@ui/components/Tooltip'
import { router } from './router'
import '../styles/globals.css'

// Register all base modules before the app mounts
import '../modules/base'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <TooltipProvider delay={400}>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>
)
