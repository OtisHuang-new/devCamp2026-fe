import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

import PageLanding from './features/LandingPage/index';
import SurveyPage from './features/Survey';
import Roadmap from './features/Roadmap';
import LessonDetail from './features/LessonDetail';
import { Profile } from './features/Profile';
import { Layout } from './shared/Layout';
import { ExerciseList } from './features/Exercise';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/landing" element={<PageLanding />} />
          <Route path="/survey" element={<SurveyPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route element={<Layout />}>
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/exercises" element={<ExerciseList />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/roadmap" replace />} />

        <Route path="*" element={<Navigate to="/roadmap" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
