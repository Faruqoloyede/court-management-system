import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login'
import CasesPage from './pages/CasesPage';
import AddCasePage from './pages/AddCasePage';
import CaseDetailsPage from './pages/CaseDetails';

const App = () => {
  return (
   <Router>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/dashboard' element={<Home />} />
      <Route path='/cases' element={<CasesPage />} />
      <Route path='/addcase' element={<AddCasePage />} />
      <Route path='/cases/:id' element={<CaseDetailsPage />} />
    </Routes>
   </Router>
  )
}

export default App