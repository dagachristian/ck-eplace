import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from '../services/auth';
import Router from './router';

import './App.less';

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Router />
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
