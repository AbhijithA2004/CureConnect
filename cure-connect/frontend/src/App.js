import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

// Components
import Home from './components/Home';
import AllDoctors from './components/AllDoctors';
import Login from './components/Login';
import Register from './components/Register';
import AdminPanel from './components/AdminPanel';
import About from './components/About';
import MyAppointments from './components/MyAppointments';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/doctors" component={AllDoctors} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/about" component={About} />
          <Route path="/my-appointments" component={MyAppointments} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
