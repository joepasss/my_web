import { type ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage, PhotoDetailPage, AdminPage, LoginPage } from "@pages";
import { TOKEN_NAME } from "@api";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem(TOKEN_NAME);
  if (!token || token === "undefined" || token === "null")
    return <Navigate to="/login" replace />;

  return <>{children}</>;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/photos/:id" element={<PhotoDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
