import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import reduxStore from './Data/reduxStore.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={reduxStore}>
            <App />
        </Provider>
    </StrictMode>,
)