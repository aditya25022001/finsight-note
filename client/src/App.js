import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { LoginScreen } from './screens/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { HomeScreen } from './screens/HomeScreen'
import { SidePanel } from './components/SidePanel'

function App() {
  return (
    <Router>
      <Redirect from="/" to="/note" exact />
      <Route path="/login" component={LoginScreen} exact/>
      <Route path="/register" component={RegisterScreen} exact/>
      <Route path='/side' component={SidePanel} exact/>
      <Route path="/note" component={HomeScreen} exact/>
    </Router>
  );
}

export default App;
