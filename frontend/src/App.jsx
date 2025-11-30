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
    setTimeout(() => setError(''), 3000);
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
      <div className="login-wrapper">
        <div className="card login-card">
          <h1 className="login-title">Employee Shift Board</h1>
          <p className="login-subtitle">
            Sign in with an admin or normal user account to manage and view employee shifts.
          </p>

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

            <button type="submit" style={{ marginTop: '0.75rem' }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const { user, token } = auth;

  const handleNewShift = (shift) => {
    setShifts((prev) => [...prev, shift]);
  };

  return (
    <div className="page dashboard-shell">
      <header className="topbar">
        <div className="topbar-left">
          <h2>Employee Shift Board</h2>
          <p>
            Logged in as <strong>{user.name}</strong> ({user.role})
          </p>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="card filter-card">
        <label>
          Date Filter
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </label>
        <div className="filter-actions">
          <button onClick={loadShifts} disabled={loadingShifts}>
            {loadingShifts ? 'Loading...' : 'Refresh'}
          </button>
        </div>
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
