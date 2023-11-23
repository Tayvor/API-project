import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';

import * as sessionActions from './store/session';

import Navigation from './components/Navigation';
import Spots from './components/Spots';
import CreateASpot from './components/CreateASpot';

import './App.css'
import SpotDetails from './components/SpotDetails/SpotDetails';
import ManageSpots from './components/ManageSpots/ManageSpots';
import UpdateSpot from './components/UpdateSpot/UpdateSpot'

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreSessionUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <hr width='100%' />
      {isLoaded &&
        <Switch>
          <Route exact path='/'>
            <div className='all-spots'>
              <Spots />
            </div>
          </Route>

          <Route path='/spots/new'>
            <div className='createASpot'>
              <CreateASpot />
            </div>
          </Route>

          <Route path='/spots/current'>
            <div className='manageSpots'>
              <ManageSpots />
            </div>
          </Route>

          <Route path='/spots/:spotId/edit'>
            <div className='createASpot'>
              <UpdateSpot />
            </div>
          </Route>

          <Route exact path='/spots/:spotId'>
            <div className='currSpot'>
              <SpotDetails />
            </div>
          </Route>
        </Switch>
      }
    </>
  );
}

export default App;
