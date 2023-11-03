import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from "../../store/session";
import { Redirect } from 'react-router-dom';
import './LoginForm.css'


export default function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to='/' />;

  const handleSubmit = (e) => {
    e.preventDefault();

    const userCreds = {
      credential: credential,
      password: password,
    }
    setErrors({});

    // .catch isn't working as intended
    return dispatch(loginUser(userCreds)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <>
      <h1 className="login">Log In:</h1>
      <form onSubmit={handleSubmit} className="loginForm">
        <label>Credential:
          <input
            type="text"
            value={credential}
            onChange={e => setCredential(e.target.value)}
            required
          >
          </input>
        </label>
        <label>Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          >
          </input>
        </label>
        {errors.credential && <p>{errors.credential}</p>}
        <button
          disabled={!credential || !password ? true : false}
          className="loginBtn"
        >
          Submit
        </button>
      </form>
    </>
  )
}
