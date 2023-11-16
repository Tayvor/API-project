import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";

import * as sessionActions from "../../store/session";
import { csrfFetch } from "../../store/csrf";

import './LoginForm.css'


export default function LoginFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);

  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.loginUser({ credential, password }))
      .then(() => closeModal())
      .then(history.push('/'))
      .catch(async (res) => {
        const data = await res.json();
        setErrors({ ...data })

        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = (e) => {
    e.preventDefault();
    // todo
    // login as demo user, need to create demo user!
  }

  useEffect(() => {
    setDisabled(true)
    if (credential.length > 3 &&
      password.length > 5) {
      setDisabled(false)
    }
  }, [credential, password])

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
        {errors.message && <p className="err">The provided credentials were invalid.</p>}

        <button
          disabled={disabled}
          className="loginBtn"
        >
          Log In
        </button>
      </form>

      <div className="demoLogin">Demo User</div>
    </>
  )
}
