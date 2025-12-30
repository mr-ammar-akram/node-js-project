import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/AllUsers";
import AddUser from "./pages/AddUser";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import Author from "./pages/Author";
import AllPosts from "./pages/AllPosts";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import SinglePost from "./pages/SinglePost";

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
        <Route path="/users" element={<AllUsers />} />

        <Route 
          path="/users/add" element={
            <ProtectedRoute>
              <Layout>
                <AddUser />
              </Layout>
            </ProtectedRoute>
          } />
        <Route 
          path="/author" element={
            <ProtectedRoute>
              <Layout>
                <Author />
              </Layout>
            </ProtectedRoute>
          } />
        <Route path="/posts" element={<AllPosts />} />
        <Route path="/posts/:slug" element={<SinglePost />} />
        <Route 
          path="/posts/add" element={
            <ProtectedRoute>
              <Layout>
                <AddPost />
              </Layout>
            </ProtectedRoute>
          } />
        <Route 
          path="/editpost" element={
            <ProtectedRoute>
              <Layout>
                <EditPost />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
