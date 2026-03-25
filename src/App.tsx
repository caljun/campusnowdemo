import { BrowserRouter, useLocation, Navigate } from "react-router-dom";
import { PostsProvider } from "./context/PostsContext";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";

function AppContent() {
  const location = useLocation();
  const path = location.pathname;

  if (path !== "/" && path !== "/list") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div style={{ display: path === "/" ? "block" : "none" }}>
        <HomePage />
      </div>
      <div style={{ display: path === "/list" ? "block" : "none" }}>
        <ListPage />
      </div>
    </>
  );
}

export default function App() {
  return (
    <PostsProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PostsProvider>
  );
}
