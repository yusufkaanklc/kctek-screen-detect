import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"; // İçe aktarma değişikliğine dikkat edin
import { Button, Flex } from "@chakra-ui/react";
import Home from "./Pages/Home";
import QuestPage from "./Pages/QuestPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questPage" element={<QuestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
