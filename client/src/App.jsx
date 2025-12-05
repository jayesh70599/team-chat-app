import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={!user ? <Auth /> : <Navigate to="/chat" />} 
      />
      <Route 
        path="/chat" 
        element={user ? <Chat /> : <Navigate to="/auth" />} 
      />
      <Route path="*" element={<Navigate to="/auth" />} />
    </Routes>
  );
}

export default App;
