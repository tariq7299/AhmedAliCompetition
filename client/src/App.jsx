import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import PrivateRoute from "./pages/PrivateRoute";
import AuthProvider from "./hooks/AuthProvider";

function App() {

  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route element={<PrivateRoute />}>
              <Route element={<h1>LAYOUT COMP</h1>}>
                <Route index element={<h2>HOME PAGE</h2>} />
              </Route>
              {/* <Route path="/" element={<Home />}></Route> */}
            </Route>
         
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
