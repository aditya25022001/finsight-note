import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { AddNoteScreen } from './screens/AddNoteScreen'

function App() {
  return (
    <Router>
      <Route path="/login" component={LoginScreen} exact/>
      <Route path="/register" component={RegisterScreen} exact/>
      <Route path="/addnote" component={AddNoteScreen} exact/>
      <Route path="/" component={HomeScreen} exact/>
    </Router>
  );
}

export default App;