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

      <NavLink exact to='/' style={{ textDecoration: 'none' }}>
        <div className="headerLeft">
          <i className="fab fa-airbnb fa-rotate-180"></i>
          <div>airbnb</div>
        </div>
      </NavLink>

      <div className="header-right">
        {sessionUser ?
          <div onClick={viewNewSpotForm} className="newSpotDiv">Create a New Spot</div>
          : null
        }
        {isLoaded && <ProfileButton user={sessionUser} />}
      </div>

    </div>
  )
};
