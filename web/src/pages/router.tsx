import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAuth } from '../services/auth';
import Login from './login';
import Home from './home';
import Profile from './profile';

let savedPath = '/home';

export default function Router() {
  const { loggedIn, currentSession } = useAuth();
  const [ sameSession, setSameSession ] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const authed = await currentSession();
      setSameSession(authed?true:false);
    }
    checkSession()
  }, [sameSession, loggedIn, currentSession])

  function ProtectedRoute() {
    return (loggedIn || sameSession)?<Outlet />:<Navigate to='/login' replace />;
  }

  function PublicRoute() {
    const path = useLocation().pathname;
    if (path !== '/login' && path !== '/') savedPath = path
    return <Outlet />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' replace/>}/>
        <Route element={<PublicRoute />}>
          <Route path='/home' element={<Home />}/>
          <Route path='/login' element={(loggedIn || sameSession)?<Navigate to={savedPath} replace />:<Login />}/>
          <Route element={<ProtectedRoute />}>
            <Route path='/profile' element={<Profile />}/>
          </Route>
        </Route>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}