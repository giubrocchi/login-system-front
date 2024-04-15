import { FormEvent, useState } from 'react';
import styles from '@/styles/Login.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {
  const signInAction = 'signIn';
  const signUpAction = 'signUp';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [action, setAction] = useState(signInAction);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (action === signInAction) await signIn();

    if (action === signUpAction) await signUp();
  }

  async function signIn() {
    const url = 'http://localhost:8080/user/login';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: username, password }),
    });

    if (response.status !== 200) {
      toast.error(await response.text());

      return;
    }

    const jsonResponse = (await response.json()) ?? {};

    localStorage.setItem('userId', jsonResponse.id);
    window.dispatchEvent(new Event('storage'));
  }

  async function signUp() {
    if (password != passwordCheck) {
      toast.error(`Passwords don't match`);

      return;
    }

    const url = 'http://localhost:8080/user/';
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.status !== 200) {
      const jsonResponse = await response.json();

      toast.error(jsonResponse.message);

      return;
    }

    toast.success('Successfully signed up! You can now sign in :D');
    setUsername('');
    setPassword('');
    setAction(signInAction);
  }

  return (
    <div>
      <h1 style={{ color: 'var(--dark-blue-base-color)', textAlign: 'center' }}>
        {action === signInAction
          ? 'Login now with your account.'
          : 'Welcome! Create your account now.'}
      </h1>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <label className={styles.formLabel}>
          {action === signInAction ? 'Username or e-mail' : 'Username'}
        </label>
        <input
          type="text"
          maxLength={100}
          required
          className={styles.formInput}
          placeholder={action === signInAction ? 'Username or e-mail' : 'Username'}
          value={username}
          onInput={(event) => setUsername(event.currentTarget.value)}
        />
        {action === signUpAction && (
          <>
            <label className={styles.formLabel}>E-mail</label>
            <input
              type="email"
              maxLength={100}
              required
              className={styles.formInput}
              placeholder="E-mail"
              value={email}
              onInput={(event) => setEmail(event.currentTarget.value)}
            />
          </>
        )}
        <label className={styles.formLabel}>Password</label>
        <input
          type="password"
          maxLength={100}
          required
          className={styles.formInput}
          placeholder="********"
          value={password}
          onInput={(event) => setPassword(event.currentTarget.value)}
        />
        {action === signUpAction && (
          <>
            <label className={styles.formLabel}>Check password</label>
            <input
              type="password"
              maxLength={100}
              required
              className={styles.formInput}
              placeholder="********"
              value={passwordCheck}
              onInput={(event) => setPasswordCheck(event.currentTarget.value)}
            />
          </>
        )}
        <button type="submit" className={styles.formButton}>
          {action === signInAction ? 'Sign in' : 'Sign up'}
        </button>
        {action === signInAction && (
          <span className={styles.actionContainer}>
            <p>Want to sign up? </p>
            <p className={styles.actionButton} onClick={() => setAction(signUpAction)}>
              Click here
            </p>
            <p> to create an account.</p>
          </span>
        )}
        {action === signUpAction && (
          <span className={styles.actionContainer}>
            <p>Already have an account? </p>
            <p className={styles.actionButton} onClick={() => setAction(signInAction)}>
              Click here
            </p>
            <p> to sign in.</p>
          </span>
        )}
      </form>
      <Toaster />
    </div>
  );
}
