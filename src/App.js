import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './components/login';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Home from './components/Home';
import AdminPanel from './components/admin/Admin';
import Footer from './components/Footer';
import Careers from './components/CareerPage';
import StudentsPage from './components/admin/studentApproval';
import ApproveAlumni from './components/admin/approveAlumni';
import ClubPage from './components/admin/clubPage';
import ClubAdmin from './components/admin/clubAdminLoginPage';
import ClubAdminLoginPage from './components/admin/clubAdminLoginPage';
import ClubAdminPage from './components/admin/clubAdmin';
import StudentDashboard from './components/admin/studentsDashboard/studentDashboard';
import ClubsList from './components/admin/studentsDashboard/joinClub';
import AlumniDashboard from './components/admin/alumni';
import GrievanceLodging from './components/admin/studentsDashboard/lodgeGrievance';
import GrievanceList from './components/admin/grievances';
import ExploreAlumni from './components/admin/studentsDashboard/exploreAlumni';

function App() {
 

    

  return (
    <>
      <ChakraProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPanel/>} />
            
          <Route path='/career' element={<Careers/>}></Route>
          <Route path="/admin/newstudents" element={<StudentsPage/>}/>
          <Route path="/admin/approveAlumni" element={<ApproveAlumni/>}/>
          <Route path="/admin/clubPage" element={<ClubPage/>}/>
          <Route path="/clubAdminloginPage" element={<ClubAdminLoginPage/>}/>
          <Route path="/clubAdminPage" element={<ClubAdminPage/>}/>
          <Route path="/studentDashboard" element={<StudentDashboard/>}/>
          <Route path="/studentDashboard/joinClubs" element={<ClubsList/>}/>
          <Route path="/alumniDashboard" element={<AlumniDashboard/>}/>
          <Route path="/studentDashboard/lodgeGrievance" element={<GrievanceLodging/>}></Route>
          <Route path="/admin/grievances" element={<GrievanceList/>}/>
          <Route path="/studentDashboard/exploreAlumni" element={<ExploreAlumni/>}/>


        </Routes>
        <Footer />
      </ChakraProvider>
    </>
  );
}

export default App;