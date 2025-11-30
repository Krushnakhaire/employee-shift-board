import React, { useState, useEffect, useCallback } from 'react';
import { loginApi, getShiftsApi } from './api';
import ShiftForm from './components/ShiftForm';
import ShiftTable from './components/ShiftTable';

const App = () => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [shifts, setShifts] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');
  const [loadingShifts, setLoadingShifts] = useState(false);

  useEffect(() => {
    if (auth) {
      localStorage.setItem('auth', JSON.stringify(auth));
    } else {
      localStorage.removeItem('auth');
    }
  }, [auth]);

  const showError = useCallback((msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  }, []);

  const loadShifts = useCallback(async () => {
    if (!auth) return;
    setLoadingShifts(true);
    try {
      const params = {};
      if (dateFilter) params.date = dateFilter;
      const data = await getShiftsApi(auth.token, params);
      setShifts(data);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoadingShifts(false);
    }
  }, [auth, dateFilter, showError]);

  useEffect(() => {
    if (auth) {
      loadShifts();
    }
  }, [auth, loadShifts]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const email = form.get('email');
    const password = form.get('password');

    try {
      const data = await loginApi(email, password);
      setAuth(data);
    } catch (err) {
      showError(err.message);
    }
  };

  const handleLogout = () => {
    setAuth(null);
    setShifts([]);
    setDateFilter('');
  };

  if (!auth) {
    
    return (
      <div className="page">
        <div className="card">
          <h2>Employee Shift Board</h2>
          <p>Login as admin or normal user.</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                name="email"
                defaultValue="hire-me@anshumat.org"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                defaultValue="HireMe@2025!"
                required
              />
            </label>

            <button type="submit">Login</button>
          </form>

          <p style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
            Demo accounts:<br />
            Admin: hire-me@anshumat.org / HireMe@2025!<br />
            User: user@example.com / User@1234
          </p>
        </div>
      </div>
    );
  }

  const { user, token } = auth;

  const handleNewShift = (shift) => {
    setShifts((prev) => [...prev, shift]);
  };

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <h2>Employee Shift Board</h2>
          <p style={{ fontSize: '0.85rem', color: '#555' }}>
            Logged in as {user.name} ({user.role})
          </p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <label>
          Date filter
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </label>
        <button onClick={loadShifts} disabled={loadingShifts}>
          {loadingShifts ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="layout">
        {user.role === 'admin' && (
          <ShiftForm
            token={token}
            onShiftCreated={handleNewShift}
            showError={showError}
          />
        )}

        <ShiftTable
          token={token}
          shifts={shifts}
          setShifts={setShifts}
          role={user.role}
          showError={showError}
        />
      </div>
    </div>
  );
};

export default App;
