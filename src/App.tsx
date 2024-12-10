import Board from "./components/Board";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import About from "./pages/About";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Board />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
