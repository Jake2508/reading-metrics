import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Nav } from "./components/ui/Nav";
import { Dashboard } from "./features/dashboard/Dashboard";
import { BookList } from "./features/books/BookList";
import { AdminPanel } from "./features/admin/AdminPanel";

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === "true";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-[#f5f5f5]">
          <Nav />
          <main className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<BookList />} />
              <Route
                path="/admin"
                element={IS_STATIC ? <Navigate to="/" replace /> : <AdminPanel />}
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
