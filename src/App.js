import './App.css';
import Home from './screens/Home/Home';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Notes from './screens/Notes/Notes';
import Todo from './screens/Todo/Todo';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Scheduler from './screens/scheduler/Scheduler';
import Diary from './screens/diary/Diary';
// import DailyTask from './screens/dailytask/DailyTask';
import Goals from './screens/goals/Goals';
import Login from './screens/login/Login';
import ProtectedRoute from './protectedroute/ProtectedRoute';
import { AuthProvider } from './protectedroute/AuthContext';
import HomeButton from './components/HomeButton/HomeButton';


function App() {
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const content = document.querySelector('.App');
    if (content) {
      setContentHeight(content.offsetHeight);
    }
    console.log(window.innerHeight);
    console.log( document.documentElement.offsetHeight);
  }, []);
  return (
    <> 
      <div className="App">
    <AuthProvider> 
      <Header/>
      <HomeButton/>
      <Routes>
      <Route path="/" element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />   {/* Create and import NotesPage component */}
        <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />     {/* Create and import TodoPage component */}
        <Route path="/scheduler" element={<ProtectedRoute><Scheduler /></ProtectedRoute>} />  
        <Route path="/diary" element={<ProtectedRoute><Diary /></ProtectedRoute>} />   {/* Create and import DiaryPage component */}
        {/* <Route path="/dailytask" element={<ProtectedRoute><DailyTask /></ProtectedRoute>} />   Create and import DailyPage component */}
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />  {/* Create and import LongTermGoalsPage component */}
        {/* Add more routes as necessary */}
      </Routes>
      <Footer style={contentHeight < window.innerHeight ? { position: 'fixed', bottom: 0, width: '100%' } : {}} />
      </AuthProvider>
      </div>
    </>
  );
}

export default App;
