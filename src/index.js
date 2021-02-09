import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './config/i18n'
import 'animate.css/animate.min.css'
import "bootstrap/dist/css/bootstrap.min.css"
import './assets/css/main.css'
import generateStore from './redux/store'
import App from './App'
import { ToastProvider } from 'react-toast-notifications'
const store = generateStore()

ReactDOM.render(
  <Provider store={store}>
    <ToastProvider>
      <App />
    </ToastProvider>
  </Provider>,
  document.getElementById('root')
)