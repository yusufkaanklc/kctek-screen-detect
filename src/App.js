import { Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import Main from "./Main.js";

function App() {
  const [isClicked, setIsClicked] = useState(false);
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
            <Link to="/main" onClick={() => setIsClicked(true)}>
              Sınava Başlamak için tıkla
            </Link>
          </div>
        }
      />
      <Route path="/main" element={<Main isClicked={isClicked} />} />
    </Routes>
  );
}

export default App;
