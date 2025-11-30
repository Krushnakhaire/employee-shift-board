const Shift = require('../models/Shift');
const Employee = require('../models/Employee');

function combineDateTime(dateStr, timeStr) {
  return new Date(`${dateStr}T${timeStr}:00.000Z`);
}

function hoursDiff(start, end) {
  const diffMs = end - start;
  return diffMs / (1000 * 60 * 60);
}

exports.createShift = async (req, res) => {
  const { employeeId, date, startTime, endTime } = req.body;

  if (!employeeId || !date || !startTime || !endTime) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const startDateTime = combineDateTime(date, startTime);
    const endDateTime = combineDateTime(date, endTime);

    if (endDateTime <= startDateTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const diffHours = hoursDiff(startDateTime, endDateTime);
    if (diffHours < 4) {
      return res.status(400).json({ message: 'Shift must be at least 4 hours long' });
    }

    const overlapping = await Shift.findOne({
      employee: employeeId,
      date,
      startDateTime: { $lt: endDateTime },  
      endDateTime: { $gt: startDateTime }   
    });

    if (overlapping) {
      return res.status(400).json({ message: 'Shift overlaps with an existing shift' });
    }

    const shift = await Shift.create({
      employee: employeeId,
      date,
      startTime,
      endTime,
      startDateTime,
      endDateTime,
      createdBy: req.user._id
    });

    const populated = await shift.populate('employee');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating shift:', err.message);
    res.status(500).json({ message: 'Server error while creating shift' });
  }
};

exports.getShifts = async (req, res) => {
  try {
    let { employee, date } = req.query;
    const user = req.user;

    const query = {};

    if (user.role === 'user') {
      if (user.employeeCode) {
        const emp = await Employee.findOne({ employeeCode: user.employeeCode });
        if (!emp) {
          return res.json([]); 
        }
        query.employee = emp._id;
      } else {
        return res.json([]);
      }
    } else {
      if (employee) {
        query.employee = employee;
      }
    }

    if (date) {
      query.date = date;
    }

    const shifts = await Shift.find(query)
      .populate('employee')
      .sort({ date: 1, startDateTime: 1 });

    res.json(shifts);
  } catch (err) {
    console.error('Error fetching shifts:', err.message);
    res.status(500).json({ message: 'Server error while fetching shifts' });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await Shift.findById(id);

    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    await shift.deleteOne();
    res.json({ message: 'Shift deleted' });
  } catch (err) {
    console.error('Error deleting shift:', err.message);
    res.status(500).json({ message: 'Server error while deleting shift' });
  }
};