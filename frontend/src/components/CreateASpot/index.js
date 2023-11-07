import { useState } from "react";
import './CreateASpot.css';

export default function CreateASpot() {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <form className="newSpotForm" onSubmit={handleSubmit}>

        <h2>Create a new Spot</h2>
        <h3>Where's your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation.</p>

        <label>
          Country
          <input></input>
        </label>
        <label>
          Street Address
          <input></input>
        </label>
        <label>
          City
          <input></input>
        </label>
        <label>
          State
          <input></input>
        </label>
        <label>
          Latitude
          <input></input>
        </label>
        <label>
          Longitude
          <input></input>
        </label>

        <h3>Describe your place to guests</h3>
        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
        <label>
          <textarea></textarea>
        </label>

        <h3>Create a title for your spot</h3>
        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
        <label>
          <input></input>
        </label>

        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <label>
          $<input></input>
        </label>

        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <label>
          <input></input>
          <input></input>
          <input></input>
          <input></input>
          <input></input>
        </label>

        <button>Create Spot</button>
      </form>
    </>
  )
}
