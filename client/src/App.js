import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { LoginScreen } from './screens/LoginScreen'
import { RegisterScreen } from './screens/RegisterScreen'
import { HomeScreen } from './screens/HomeScreen'
import { SidePanel } from './components/SidePanel'
import { Home } from './screens/Home'

function App() {
  return (
    <Router>
      <Route path="/login" component={LoginScreen} exact/>
      <Route path="/register" component={RegisterScreen} exact/>
      <Route path='/side' component={SidePanel} exact/>
      <Route path="/note" component={HomeScreen} exact/>
      <Route path="/" component={Home} exact/>
    </Router>
  );
}

export default App;
