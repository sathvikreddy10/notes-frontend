import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* import AskForm from "./AskForm"; */
import AskForm from "./AskForm3";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AskForm />} />
      </Routes>
    </Router>
  );
}

export default App;

