import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import socketService from '../lib/socket';
import toast from 'react-hot-toast';
import { UserRole } from '../types';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notification, setNotification] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const socket = socketService.getSocket();
        
        if(socket) {
            socket.on('attendance_report_sent', (data) => {
                toast.success('Attendance report sent');
                setNotification((prev) => [...prev, data]);
            });

            socket.on('library_check', (data) => {
                toast(data.message);
            });
            
            socket.on('fee_check', (data) => {
                toast(data.message);
            });
        }

        return () => {
            socket?.off('attendance_report_sent');
            socket?.off('library_check');
            socket?.off('fee_check');
        };
    }, []);

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT]},
        { path: '/students', label: 'Students', icon: '👨‍🎓', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER]},
        { path: '/teachers', label: 'Teachers', icon: '🧑‍🏫', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL]},
        { path: '/attendance', label: 'Attendance', icon: '🗓️', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER]},
        { path: '/grades', label: 'Grades', icon: '📝', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT]},
        { path: '/fees', label: 'Fees', icon: '💵', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.PARENT]},
        { path: '/library', label: 'Library', icon: '📚', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.STUDENT]},
        { path: '/transport', label: 'Transport', icon: '🚌', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL]},
        { path: '/settings', label: 'Settings', icon: '⚙️', roles: [UserRole.SUPER_ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER, UserRole.PARENT, UserRole.STUDENT ]},
    ];

    const filteredMenuItems = menuItems.filter((item) => user ? item.roles.includes(user.role) : false);

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
                <div className="p-4 border-b">
                    <h1 className={`font-bold text-primary-600 ${sidebarOpen ? 'text-xl' : 'text-sm'}`}>
                        {sidebarOpen ? 'School Dashboard' : 'SD'}
                    </h1>
                </div>

                <nav className='flex-1 p-4 space-y-2'>
                    {filteredMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex item-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={()=> setSidebarOpen(!sidebarOpen)}
                    className="p-4 border-t hover:bg-gray-50 text-gray-600"
                >
                    {sidebarOpen ? '◀' : '▶'}
                </button>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm px-6 py-4 flex item-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome, {user?.firstName} {user?.lastName}
                    </h2>

                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={()=> setShowNotifications(!showNotifications)}
                                className="p-2 hover:bg-gray-100 rounded-full relative"
                            >
                            🔔 {notification.length > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notification.length}
                                </span>
                            )}
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                                    <div className="p-4 border-b">
                                        <h3 className="font-semibold">Notifications</h3>
                                    </div>
                                    {notification.length == 0 ? (
                                        <p className="p-4 text-gray-500 text-center">No notifications</p>
                                    ):(
                                        notification.map((notif, index)=>(
                                            <div key={index} className="p-4 borer-b hover:bg-gray-50">
                                                <p className="text-sm">{notif.message}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >Logout</button>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;