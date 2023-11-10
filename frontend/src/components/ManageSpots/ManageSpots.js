import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import blueHouse from './blueHouse.avif'

import * as spotActions from '../../store/spots';

export default function ManageSpots() {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(spotActions.getSpotsByCurrUser())
      // .catch(async (data) => {
      //   const problem = await data.json();
      //   console.log(problem)
      // })
      .then(() => setIsLoaded(true))
  }, [dispatch]);

  const userSpots = Object.values(useSelector((state) => state.spots.userSpots));
  // if (userSpots) console.log(userSpots);

  return (
    <>
      <h2>Manage Your Spots</h2>
      <button>Create a New Spot</button>
      {isLoaded && (


        <div>
          {

            <img src={blueHouse} style={{ height: 260, width: 270, borderRadius: 15 }}></img>
          }
        </div>
      )
      }
    </>
  )
}
