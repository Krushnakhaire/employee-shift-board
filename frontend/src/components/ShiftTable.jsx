import React from 'react';
import { deleteShiftApi } from '../api';

const ShiftTable = ({ token, shifts, setShifts, role, showError }) => {
  const handleDelete = async (id) => {
    try {
      await deleteShiftApi(token, id);
      setShifts((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      showError(err.message);
    }
  };

  return (
    <div className="card">
      <h3>Shifts</h3>
      {shifts.length === 0 ? (
        <p>No shifts found.</p>
      ) : (
        <table className="shift-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Code</th>
              <th>Dept</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              {role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {shifts.map((s) => (
              <tr key={s._id}>
                <td>{s.employee?.name}</td>
                <td>{s.employee?.employeeCode}</td>
                <td>{s.employee?.department}</td>
                <td>{s.date}</td>
                <td>{s.startTime}</td>
                <td>{s.endTime}</td>
                {role === 'admin' && (
                  <td>
                    <button onClick={() => handleDelete(s._id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShiftTable;
