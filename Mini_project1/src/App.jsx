import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Navbar/Home';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="relative">
        <Navbar />
        <Home />
      </div>
    </ThemeProvider>
  );
}

export default App;

