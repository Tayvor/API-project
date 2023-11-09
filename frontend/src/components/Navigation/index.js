import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import ProfileButton from "./ProfileButton";

import './Navigation.css';

export default function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const viewNewSpotForm = (e) => {
    e.preventDefault();
    history.push('/spots/new');
  };

  return (
    <div className="header">
      <NavLink exact to='/'>Home</NavLink>

      <div className="header-right">
        {sessionUser ?
          <button onClick={viewNewSpotForm}>Create a New Spot</button>
          : null
        }
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>
    </div>
  )
};
