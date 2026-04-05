import { useState, useReducer, useEffect } from 'react'
import './App.css'
import MyUserReducer, { type MyUserState } from './components/reducer/MyUserReducer';
import Cookies from 'js-cookie';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GamingLogin from './pages/Login';
import GamingRegister from './pages/Register';
import ChatPage from './pages/ChatPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/AdminGuard';
import { authApis, endPoints } from './services/apis';
import { MyDispatcherContext, MyUserContext } from './services/MyContexts.ts';
import { ToastProvider } from './components/Toast';

function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null as MyUserState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = Cookies.get("token");

      const finalToken = token;

      if (finalToken && finalToken !== "undefined" && finalToken !== "null") {
        try {
          if (finalToken.length < 10) {
            Cookies.remove("token");
            dispatch({
              type: "logout",
              payload: null,
            });
            setLoading(false);
            return;
          }

          const res = await authApis().get(endPoints.users.me);
          dispatch({
            type: "login",
            payload: res.data,
          });
        } catch (err) {
          console.error("Lỗi load user từ token:", err);
          Cookies.remove("token");
          dispatch({
            type: "logout",
            payload: null,
          });
        }
      } else {
        dispatch({
          type: "logout",
          payload: null,
        });
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-300">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-blue-600 font-semibold">Loading...</p>
      </div>
    </div>
  );

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatcherContext.Provider value={dispatch}>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<GamingLogin />} />
              <Route path="/register" element={<GamingRegister />} />
              <Route path="/" element={<ChatPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminGuard>
                    <AdminDashboard />
                  </AdminGuard>
                } 
              />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </MyDispatcherContext.Provider>
    </MyUserContext.Provider>

  );
}

export default App