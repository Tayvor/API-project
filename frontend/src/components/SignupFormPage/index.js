import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from '../../store/session';
import './SignupForm.css'

export default function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to='/' />;

  const handleSignup = (e) => {
    e.preventDefault();
    setErrors({});
    const err = {};

    if (password !== confirmPassword) {
      err.password = 'Passwords do not match!'
      setErrors(err);
      return
    }

    return dispatch(
      sessionActions.signupUser({
        email,
        username,
        firstName,
        lastName,
        password,
      })
    ).catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors)
      }
    })
  }

  return (
    <>
      <h1>Signup:</h1>
      <form onSubmit={handleSignup} className="signupForm">
        <label>
          Username:
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          ></input>
        </label>
        <label>
          First Name:
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
          ></input>
        </label>
        <label>
          Last Name:
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            required
          ></input>
        </label>
        <label>
          Email:
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          ></input>
        </label>
        <label>
          Password:
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          ></input>
        </label>
        <label>
          Confirm Password:
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          ></input>
        </label>
        {errors.password && <span>{errors.password}</span>}
        <button type="submit">Sign Up!</button>
      </form>
    </>
  )
}
