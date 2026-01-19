import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Attendence from './pages/Attendence';
import Fees from './pages/Fees';
import Grades from './pages/Grades';
import Library from './pages/Library';
import Transport from './pages/Transport';
import Settings from './pages/Settings';
import { UserRole } from './types';

function App(){
    return(
        <AuthProvider>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/teachers" element={<Teachers />} />
                        <Route path="/attendence" element={<Attendence />} />
                        <Route path="/fees" element={<Fees />} />
                        <Route path="/grades" element={<Grades />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/transport" element={<Transport />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;