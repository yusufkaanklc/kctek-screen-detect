import { Route, Routes, Link } from "react-router-dom";
import Main from "./Main.js";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Link to="/main">Sınava Başlamak için tıkla</Link>
          </div>
        }
      />
      <Route path="/main" element={<Main />} />
    </Routes>
  );
}

export default App;
