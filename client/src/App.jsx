import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import PrivateRoute from "./pages/PrivateRoute";
import AuthProvider from "./hooks/AuthProvider";
import Layout from "./components/common/Layout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
      <ToastContainer/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route index element={<h2>HOME PAGE</h2>} />
              </Route>
             
            </Route>
         
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
