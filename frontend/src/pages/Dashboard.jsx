import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import AnalyticsSection from '../components/AnalyticsSection';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeModal from '../components/EmployeeModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  Plus,
  LogOut,
  Grid,
  AlertCircle,
  Building,
  RefreshCw
} from 'lucide-react';

const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 6 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/employees', {
        params: {
          page: currentPage,
          limit: 6,
          search: debouncedSearch,
          department: selectedDept,
          status: selectedStatus,
        },
      });
      if (res.data.success) {
        setEmployees(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch employee list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await axios.get('/employees/analytics');
      if (res.data.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load statistics', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [debouncedSearch, selectedDept, selectedStatus, currentPage]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleEmployeeSubmit = async (formData) => {
    try {
      let res;
      if (selectedEmployee) {
        res = await axios.put(`/employees/${selectedEmployee._id}`, formData);
      } else {
        res = await axios.post('/employees', formData);
      }

      if (res.data.success) {
        fetchEmployees();
        fetchAnalytics();
        return true;
      }
    } catch (err) {
      console.error('Submit error:', err);
      return false;
    }
  };

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return;

    try {
      const res = await axios.delete(`/employees/${employeeToDelete._id}`);
      if (res.data.success) {
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
        if (employees.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchEmployees();
        }
        fetchAnalytics();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete employee.');
    }
  };

  const handleOpenEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setIsEmployeeModalOpen(true);
  };

  const handleOpenDelete = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const triggerRefresh = () => {
    fetchEmployees();
    fetchAnalytics();
  };

  const stats = analytics?.summary || { totalEmployees: 0, activeEmployees: 0, inactiveEmployees: 0 };
  const departmentCount = analytics?.departmentDistribution?.length || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">

      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/10">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">Workforce Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400">Authenticated as</span>
              <span className="text-sm font-semibold text-slate-200">{user?.email || 'Administrator'}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/40 text-xs font-semibold text-slate-300 rounded-lg transition-colors shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">Monitor, query, and manage employee profiles and analytics.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={triggerRefresh}
              className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
              title="Sync Database"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-lg text-sm flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all"
            >
              <Plus className="w-4.5 h-4.5" />
              Add Employee
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <Users className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Staff</p>
            <h4 className="text-2xl font-bold text-white mt-1">
              {analyticsLoading ? '...' : stats.totalEmployees}
            </h4>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <UserCheck className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Employees</p>
            <h4 className="text-2xl font-bold text-emerald-400 mt-1">
              {analyticsLoading ? '...' : stats.activeEmployees}
            </h4>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <UserX className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inactive Employees</p>
            <h4 className="text-2xl font-bold text-rose-400 mt-1">
              {analyticsLoading ? '...' : stats.inactiveEmployees}
            </h4>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
              <Building className="w-16 h-16 text-white" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Divisions</p>
            <h4 className="text-2xl font-bold text-violet-400 mt-1">
              {analyticsLoading ? '...' : departmentCount}
            </h4>
          </div>
        </div>

        {analyticsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800/60 rounded-xl h-72 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
                  <span className="text-xs text-slate-500 font-medium">Loading statistics...</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnalyticsSection analyticsData={analytics} />
        )}

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4.5 w-4.5 text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-lg placeholder-slate-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm"
              />
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-500" />
              </span>
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-lg focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm appearance-none"
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-500" />
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-lg focus:ring-1 focus:ring-indigo-500/20 focus:outline-none transition-colors text-sm"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl h-96 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              <p className="text-slate-400 text-sm font-medium">Fetching active listing...</p>
            </div>
          </div>
        ) : (
          <EmployeeTable
            employees={employees}
            pagination={pagination}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onPageChange={(p) => setCurrentPage(p)}
          />
        )}

      </main>

      <footer className="py-6 border-t border-slate-800 bg-slate-900/20 text-center text-xs text-slate-500">
        © 2026 Workforce Dashboard. Built with MERN Stack. All rights reserved.
      </footer>

      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        employee={selectedEmployee}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        employeeName={employeeToDelete?.name || ''}
      />

    </div>
  );
};

export default Dashboard;
