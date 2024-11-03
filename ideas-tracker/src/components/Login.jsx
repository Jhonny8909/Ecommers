import React, { useState } from 'react';

const Login = ({ loginUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      loginUser(email, password);
    };
  
    return (
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '0.5rem', fontSize: '1rem' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '0.5rem', fontSize: '1rem', marginLeft: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          Login
        </button>
      </form>
    );
  };

export default Login;