import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Home
import Home from './components/Home/Home';

// Vishwa
import Header from './components/Taskmanagement/Header';
import Center from './components/Taskmanagement/Center';

function App() {
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
                <Header />
                <Center />
              </>
            } 
          />
          {/* Nadun */}
          {/* Vinuki */}
          {/* Sathira */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
