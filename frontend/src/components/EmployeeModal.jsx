import React, { useState, useEffect } from 'react';
import { X, Save, User, Mail, Briefcase, Award, CheckCircle, Calendar } from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

const EmployeeModal = ({ isOpen, onClose, onSubmit, employee }) => {
  const isEdit = !!employee;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState('Active');
  const [joiningDate, setJoiningDate] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setApiError('');
      if (employee) {
        setName(employee.name || '');
        setEmail(employee.email || '');
        setDepartment(employee.department || '');
        setDesignation(employee.designation || '');
        setStatus(employee.status || 'Active');
        if (employee.joiningDate) {
          const date = new Date(employee.joiningDate);
          setJoiningDate(date.toISOString().split('T')[0]);
        } else {
          setJoiningDate('');
        }
      } else {
        setName('');
        setEmail('');
        setDepartment('');
        setDesignation('');
        setStatus('Active');
        setJoiningDate(new Date().toISOString().split('T')[0]);
      }
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) tempErrors.name = 'Name is required';

    if (!email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Invalid email format';
    }

    if (!department) tempErrors.department = 'Department is required';
    if (!designation.trim()) tempErrors.designation = 'Designation is required';
    if (!status) tempErrors.status = 'Status is required';
    if (!joiningDate) tempErrors.joiningDate = 'Joining date is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) return;

    setIsSubmitting(true);
    const data = {
      name: name.trim(),
      email: email.trim(),
      department,
      designation: designation.trim(),
      status,
      joiningDate,
    };

    const success = await onSubmit(data);
    setIsSubmitting(false);

    if (success) {
      onClose();
    } else {
      setApiError('Email is already registered or server validation failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all transform scale-100">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? 'Modify Employee Profile' : 'Add New Employee'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-lg">
            {apiError}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4.5 w-4.5 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-slate-950 border ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
                  } text-white rounded-lg placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm`}
              />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="jane.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 bg-slate-950 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
                  } text-white rounded-lg placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm`}
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4.5 w-4.5 text-slate-500" />
                </span>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950 border ${errors.department ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    } text-white rounded-lg focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm appearance-none`}
                >
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              {errors.department && <p className="text-red-400 text-xs mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Designation
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award className="h-4.5 w-4.5 text-slate-500" />
                </span>
                <input
                  type="text"
                  placeholder="Software Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950 border ${errors.designation ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    } text-white rounded-lg placeholder-slate-600 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm`}
                />
              </div>
              {errors.designation && <p className="text-red-400 text-xs mt-1">{errors.designation}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Employment Status
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckCircle className="h-4.5 w-4.5 text-slate-500" />
                </span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950 border ${errors.status ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    } text-white rounded-lg focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm`}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              {errors.status && <p className="text-red-400 text-xs mt-1">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Joining Date
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4.5 w-4.5 text-slate-500" />
                </span>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-950 border ${errors.joiningDate ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-indigo-500'
                    } text-white rounded-lg focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm`}
                />
              </div>
              {errors.joiningDate && <p className="text-red-400 text-xs mt-1">{errors.joiningDate}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-medium rounded-lg text-sm shadow-lg shadow-indigo-500/10 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? 'Save Changes' : 'Create Profile'}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
