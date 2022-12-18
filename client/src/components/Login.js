import React, {useState} from 'react';
import Axios from 'axios'
import '../css/Login.css';

function Login() {

  const [userData, setUserData] = useState({});
  const [email_val, setEmail] = useState("");
  const [password_val, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const TryLogin = () => {
  
  Axios
    .post("http://localhost:3001/api/login", {email: email_val, password: password_val})
    .then((response) => {
      if (response.data === false)
        setLoginMsg("Logowanie nieudane")
        
      else{
        setUserData(response.data);
        setLoginMsg("Witaj, " + response.data.Nazwa)
      }
    })
    .catch((err) => console.log(err));
  }

  return (
      <div className="App">
        <h2>Login</h2>
        <fieldset>
          <label htmlFor="email_">E-mail</label>
          <input id="email_" type="email" name="email_val" onChange={ (e) => setEmail(e.target.value) }></input>
          <label htmlFor="password_">Haslo</label>
          <input id="password_" type="password" name="password" onChange={ (e) => setPassword(e.target.value) }></input>
          <button onClick={ TryLogin }>Login</button>
        </fieldset>
        <p className="login-message">{loginMsg}</p>
      </div>
  );
}

export default Login;
