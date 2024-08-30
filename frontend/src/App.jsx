import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Home
import Home from './components/Home/Home';

// Vishwa
import Header from './components/Taskmanagement/Header';
import Center from './components/Taskmanagement/Center';

//nadu
import BasicUI from './components/FlowChartGen/BasicUI';
import Analyzer from './components/FlowChartGen/Analyzer';

function App() {

  const [boardModalOpen, setBoardModalOpen] = useState(false);

  return (
    <Router>
      <div>
        <Routes>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Vishwa */}
          <Route 
            path="/taskmanagement" 
            element={
              <>
                <Header boardModalOpen = {boardModalOpen} setBoardModalOpen = {setBoardModalOpen} />
                <Center />
              </>
            } 
          />
          {/* Nadun */}
          <Route 
            path="/gen" 
            element={
              <>
                <BasicUI />
              </>
            } 
          />
          <Route 
          path="/gen2" 
          element={
            <>
              <Analyzer />
            </>
          } 
        />
          {/* Vinuki */}
          {/* Sathira */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
