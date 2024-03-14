import { createRoot } from 'react-dom/client'

import './index.css'

import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

import { store } from '@/state/store'
import { App } from '@/app/ui/App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
)
