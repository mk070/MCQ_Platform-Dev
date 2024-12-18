import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SinglePageStepper from './pages/singleFile'
import HomeTwo from './pages/UploadType'
import SectionDetailsPage from './pages/SectionDetailsPage';
import Question from './pages/CreateQuestion';
import Dashboard from './pages/QuestionsDashboard';
import Upload from './pages/BulkUpload';


function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path='/' element={<SinglePageStepper/>}/>
        <Route path='/sectionDetails' element={<SectionDetailsPage/>}/>

        {/* <Route path="/assessment-overview" element={<AssessmentOverview />} />
        <Route path="/test-configuration" element={<TestConfiguration />} /> */}
        <Route path='/UploadType' element = {<HomeTwo/>} />
        <Route path='/CreateQuestion' element = {<Question/>}/>
        <Route path='/QuestionsDashboard' element = {<Dashboard/>}/>
        <Route path='/BulkUpload' element = {<Upload/>}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
