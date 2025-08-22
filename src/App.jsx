import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CasesPage from './pages/CasesPage';
import AddCasePage from './pages/AddCasePage';
import CaseDetailsPage from './pages/CaseDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases"
          element={
            <PrivateRoute>
              <CasesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/addcase"
          element={
            <PrivateRoute>
              <AddCasePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/:id"
          element={
            <PrivateRoute>
              <CaseDetailsPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
