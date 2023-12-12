import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import Home from "./pages/Home";
import "./globals.css";
function App() {
  return (
    <div className="relative">
      <Navbar />
      <div className="container pt-[100px] text-white h-screen overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
