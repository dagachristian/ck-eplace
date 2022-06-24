import { AuthProvider } from '../config/auth';
import Router from './router';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
