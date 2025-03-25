import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Home from "./components/Home";
import Upload from "./components/Upload";
import SecureUpload from "./components/SecureUpload";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/secure-upload" element={<SecureUpload />} />
      </Routes>
    </>
  );
}

export default App;
