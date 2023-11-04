import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from '../../store/session';
import './SignupForm.css'

export default function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signupUser({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1>Signup:</h1>
      <form onSubmit={handleSignup} className="signupForm">
        <label>
          Email:
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          ></input>
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Username:
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          ></input>
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          First Name:
          <input
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
          ></input>
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          Last Name:
          <input
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
            required
          ></input>
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          Password:
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          ></input>
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password:
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          ></input>
        </label>
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        <button type="submit">Sign Up!</button>
      </form>
    </>
  )
}
