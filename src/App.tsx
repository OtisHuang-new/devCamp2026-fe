import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PageLanding from './features/LandingPage/index';
// import Login from "./features/auth/Login";
import SurveyPage from './features/Survey';
import Roadmap from './features/Roadmap';
import LessonDetail from './features/LessonDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<PageLanding />}></Route>
        <Route path="/survey" element={<SurveyPage />}></Route>
        <Route path="/roadmap" element={<Roadmap />}></Route>
        <Route path="/lesson-detail" element={<LessonDetail />}></Route>
        <Route path="/lessons/:id" element={<LessonDetail />} />

        <Route path="/" element={<Navigate to="/landing" replace />}></Route>
        <Route path="/*" element={<PageLanding />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
