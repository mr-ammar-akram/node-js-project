import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Author from "./pages/Author";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root */}
        <Route
          path="/"
          element={
            localStorage.getItem("token")
              ? <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/author" element={
            <ProtectedRoute>
              <Layout>
                <Author />
              </Layout>
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
