import React, { useState, useEffect } from 'react';
import { getEmployeesApi, createShiftApi } from '../api';

const ShiftForm = ({ token, onShiftCreated, showError }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployeesApi(token);
        setEmployees(data);
        if (data.length > 0) {
          setEmployeeId(data[0]._id);
        }
      } catch (err) {
        showError(err.message);
      }
    };
    loadEmployees();
  }, [token, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !date || !startTime || !endTime) {
      showError('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const newShift = await createShiftApi(token, {
        employeeId,
        date,
        startTime,
        endTime
      });
      onShiftCreated(newShift);
      setDate('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Assign Shift</h3>

      <label>
        Employee
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.employeeCode})
            </option>
          ))}
        </select>
      </label>

      <label>
        Date
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Start Time
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>

      <label>
        End Time
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Shift'}
      </button>
    </form>
  );
};

export default ShiftForm;
