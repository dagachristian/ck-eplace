import { AuthProvider } from '../services/auth';
import Router from './router';

import './App.less';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
