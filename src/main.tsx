import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import store, { persistor } from './redux/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={ "650627989436-803iq1kf32r3vm928ilnuh04f098tf4r.apps.googleusercontent.com"} >
  <Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <BrowserRouter>
    <Toaster position="top-center" expand={false} richColors />
      <App />
    </BrowserRouter>
  </PersistGate>
</Provider>
    </GoogleOAuthProvider>

// </React.StrictMode>,
)
