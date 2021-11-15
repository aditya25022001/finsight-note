import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { LoginScreen } from './screens/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { HomeScreen } from './screens/HomeScreen'
import { NoteScreen } from './screens/NoteScreen'

function App() {
  return (
    <Router>
      <Route path="/login" component={LoginScreen} exact/>
      <Route path="/register" component={RegisterScreen} exact/>
      {window.innerWidth<600 && <Route path='/note' component={NoteScreen} exact/>}
      <Route path="/" component={HomeScreen} exact/>
    </Router>
  );
}

export default App;
