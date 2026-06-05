import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MasterScreen from './components/MasterScreen';
import RaiseComplaint from './pages/RaiseComplaint';
import ComplaintsList from './pages/ComplaintsList';
import Reports from './pages/Reports';
import UserManual from './pages/UserManual';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="departments" element={
              <MasterScreen
                title="Department Master"
                endpoint="/masters/departments"
                fields={[
                  { name: 'departmentName', label: 'Department Name', type: 'text', required: true },
                  { name: 'departmentShortName', label: 'Short Name', type: 'text', required: true }
                ]}
              />
            } />
            <Route path="programmes" element={
              <MasterScreen
                title="Programme Master"
                endpoint="/masters/programmes"
                fields={[
                  { name: 'department', label: 'Department', type: 'select-model', endpoint: '/masters/departments', displayField: 'departmentName', required: true },
                  { name: 'programmeName', label: 'Programme Name', type: 'text', required: true },
                  { name: 'programmeShortName', label: 'Short Name', type: 'text', required: true }
                ]}
              />
            } />
            <Route path="blocks" element={
              <MasterScreen
                title="Block Master"
                endpoint="/masters/blocks"
                fields={[
                  { name: 'department', label: 'Department', type: 'select-model', endpoint: '/masters/departments', displayField: 'departmentName', required: true },
                  { name: 'programme', label: 'Programme', type: 'select-model', endpoint: '/masters/programmes', displayField: 'programmeName', required: true },
                  { name: 'blockName', label: 'Block Name', type: 'text', required: true }
                ]}
              />
            } />
            <Route path="rooms" element={
              <MasterScreen
                title="Room Number Master"
                endpoint="/masters/rooms"
                fields={[
                  { name: 'department', label: 'Department', type: 'select-model', endpoint: '/masters/departments', displayField: 'departmentName', required: true },
                  { name: 'programme', label: 'Programme', type: 'select-model', endpoint: '/masters/programmes', displayField: 'programmeName', required: true },
                  { name: 'block', label: 'Block', type: 'select-model', endpoint: '/masters/blocks', displayField: 'blockName', required: true },
                  { name: 'roomNumber', label: 'Room Number', type: 'text', required: true }
                ]}
              />
            } />
            <Route path="roles" element={
              <MasterScreen
                title="Role Master"
                endpoint="/masters/roles"
                fields={[
                  { name: 'roleName', label: 'Role Name', type: 'text', required: true }
                ]}
              />
            } />
            <Route path="users" element={
              <MasterScreen
                title="User Master"
                endpoint="/masters/users"
                fields={[
                  { name: 'userName', label: 'User Name', type: 'text', required: true },
                  { name: 'phoneNumber', label: 'Phone Number', type: 'text', required: true },
                  { name: 'email', label: 'Email', type: 'text', required: true },
                  { name: 'password', label: 'Password', type: 'password', required: true, hideInTable: true },
                  { name: 'role', label: 'Role', type: 'select-model', endpoint: '/masters/roles', displayField: 'roleName', required: true },
                  { name: 'department', label: 'Department', type: 'select-model', endpoint: '/masters/departments', displayField: 'departmentName' },
                  { name: 'programme', label: 'Programme', type: 'select-model', endpoint: '/masters/programmes', displayField: 'programmeName' }
                ]}
              />
            } />
            <Route path="complaints" element={<ComplaintsList />} />
            <Route path="complaints/new" element={<RaiseComplaint />} />
            <Route path="reports" element={<Reports />} />
            <Route path="user-manual" element={<UserManual />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
