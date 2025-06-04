import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage"; 
import { useEffect, useState } from "react";

function App() {
  // const token = localStorage.getItem("token");
  const [token, setToken] = useState(localStorage.getItem("token"));

   useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

 const api = import.meta.env.VITE_APP_API_KEY;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage api={api}/>} />
      <Route
        path="/products"
        element={
          token ? (
            <ProductPage api={api}/> 
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
