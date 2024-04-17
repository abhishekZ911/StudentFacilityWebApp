import './App.css';
import Navbar from './components/Navbar';
import Principal from './components/Principal';
import LoginPage from './components/login';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './components/Home';
import AdminPanel from './components/admin/Admin';
import Footer from './components/Footer';
import Careers from './components/CareerPage';
import StudentsPage from './components/admin/studentApproval';

function App() {
 

    

  return (
    <>
      <ChakraProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/principal" element={<Principal />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel/>} />
            
          <Route path='/career' element={<Careers/>}></Route>
          <Route path="/admin/newstudents" element={<StudentsPage/>}/>

      
        </Routes>
        <Footer />
      </ChakraProvider>
    </>
  );
}

export default App;