const Employee = require('../models/Employee');

const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    if (req.query.department) {
      query.department = req.query.department;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Employee.countDocuments(query);

    const employees = await Employee.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: employees.length,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      data: employees,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(444).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const createEmployee = async (req, res) => {
  try {
    const { name, email, department, designation, status, joiningDate } = req.body;

    const emailExists = await Employee.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email: email.toLowerCase(),
      department,
      designation,
      status,
      joiningDate,
    });

    res.status(201).json({ success: true, data: employee });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { name, email, department, designation, status, joiningDate } = req.body;

    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await Employee.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Employee with this email already exists' });
      }
    }

    employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email: email ? email.toLowerCase() : undefined, department, designation, status, joiningDate },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const getAnalytics = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();

    const activeEmployees = await Employee.countDocuments({ status: 'Active' });

    const inactiveEmployees = totalEmployees - activeEmployees;

    const departmentStats = await Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          department: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    const statusStats = [
      { status: 'Active', count: activeEmployees },
      { status: 'Inactive', count: inactiveEmployees },
    ];


    const monthlyJoinedRaw = await Employee.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$joiningDate' },
            month: { $month: '$joiningDate' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    const monthlyJoined = monthlyJoinedRaw.map(item => {
      const monthIndex = item._id.month - 1;
      const monthStr = monthNames[monthIndex] || 'Unknown';
      return {
        month: `${monthStr} ${item._id.year}`,
        count: item.count,
        sortKey: item._id.year * 100 + item._id.month,
      };
    });

    res.status(200).json({
      success: true,
      summary: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
      },
      departmentDistribution: departmentStats,
      statusDistribution: statusStats,
      monthlyJoiningTrend: monthlyJoined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getAnalytics,
};
