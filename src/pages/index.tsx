import { useEffect, useState } from 'react';
import Login from './Login';

export default function Home() {
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const onStorage = () => setUserId(localStorage.getItem('userId') ?? '');

    setUserId(localStorage.getItem('userId') ?? '');
    window.addEventListener('storage', onStorage);

    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function signOut() {
    localStorage.removeItem('userId');
    window.dispatchEvent(new Event('storage'));
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!userId && <Login />}
      {userId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h1 style={{ color: 'var(--dark-blue-base-color)' }}>You are logged in!</h1>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </div>
  );
}
