import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import Chat from './Chat'

createRoot(document.getElementById('root')).render(
  <StrictMode>
 <BrowserRouter>
  <Chat/>
 </BrowserRouter>
      
  </StrictMode>,
)
