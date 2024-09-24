import React from 'react';
import { Routes, Route } from 'react-router-dom';


import DrawerAppBar from './one';
import 'bootstrap/dist/css/bootstrap.css';
import AdminPage from './Admin/Adminhome';
import AdminLogin from './Admin/Otp';
import ManagerComponent from './Admin/Manager';


const App = () => {


  // You can set isAuthenticated based on your authentication mechanism

  return (
    <div>
      <DrawerAppBar />

      <Routes>
        <Route path='/adminhome' element={<AdminPage />} />
        {/* <Route path='/' element={<AdminLogin />} /> */}
        <Route path='/manager' element={<ManagerComponent />} />
      </Routes>

    </div>

  );
};

export default App;
