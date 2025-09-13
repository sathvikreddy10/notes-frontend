import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* import AskForm from "./AskForm"; */
import AskForm2 from "./askform1";
import AskForm from "./AskForm3";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AskForm />} />
        <Route path="/2" element={<AskForm2 />} />
      </Routes>
    </Router>
  );
}

export default App;

