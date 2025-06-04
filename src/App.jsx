import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage"; 

function App() {
  const token = localStorage.getItem("token");

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
