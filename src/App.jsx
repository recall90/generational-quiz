import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;