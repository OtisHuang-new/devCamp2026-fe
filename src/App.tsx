import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PageLanding from './features/LandingPage/index';
// import Login from "./features/auth/Login";
import SurveyPage from './features/Survey';
import Register from './features/auth/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<PageLanding />}></Route>
        <Route path="/survey" element={<SurveyPage />}></Route>
        <Route path="/register" element={<Register />}></Route>

        <Route path="/" element={<Navigate to="/landing" replace />}></Route>
        <Route path="/*" element={<PageLanding />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
