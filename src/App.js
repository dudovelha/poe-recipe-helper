import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/highlight">
            <About />
          </Route>
          <Route path="/config">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>default</h2>;
}

function About() {
  return <h2>highlight</h2>;
}

function Users() {
  return <h2>config</h2>;
}

export default App;
