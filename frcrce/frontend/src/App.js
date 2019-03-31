import React, { Component } from 'react';
import {BrowserRouter,Switch,Route} from 'react-router-dom'
import LandingPage from './Components/Input'
import Header from './Components/Reusable/Header'
import {Paper} from '@material-ui/core'
import './app.css'
class App extends Component {
  render() {
    return (
      <div className="App">
        {/*<BrowserRouter>
          <Switch>
            <Route path='/' exact Component={LandingPage}/>
          </Switch>
        </BrowserRouter>*/}
        <Header/>
        <div className='wrapper' >
          <LandingPage/>
        </div>
      </div>
    );
  }
}

export default App;
