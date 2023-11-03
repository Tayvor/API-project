import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginUser } from "../../store/session";


export function LoginFormPage() {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userInfo = {
      credential: credential,
      password: password,
    }

    dispatch(loginUser(userInfo));

    history.push('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Credential:
        <input onChange={e => setCredential(e.target.value)}></input>
      </label>
      <label>Password:
        <input onChange={e => setPassword(e.target.value)}></input>
      </label>
      <button disabled={!credential || !password ? true : false}>Submit</button>
    </form>
  )
}

// export LoginFormPage;
