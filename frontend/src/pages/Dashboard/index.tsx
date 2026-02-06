import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Users, GraduationCap, TrendingUp, TrendingDown, IndianRupee, Calendar } from 'lucide-react';

interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    attendanceRate: number;
    pendingFees: number;
    totalClasses: number;
    activeRoutes: number;
}

interface AttendanceData {
    date: string;
    present: number;
    absent: number;
    rate: number;
}

interface FeeData{
    status: string;
    amount: number;
    count: number;
}

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const [ loading, setLoading ] = useState(true);
    const [ stats, setStats ] = useState<DashboardStats>({
        totalStudents: 0,
        totalTeachers: 0,
        attendanceRate: 0,
        pendingFees: 0,
        totalClasses: 0,
        activeRoutes: 0,
    });

    const[attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
    const[feeData,setFeeData] = useState<FeeData[]>([]);
    
    useEffect(() => {
        fetchDashboardData();
    },[]);

    const fetchDashboardData = async () => {
        try{
            setLoading(true);
            const [studentsRes, teachersRes, classesRes, routesRes, feesRes, attendanceRes ] = await Promise.all([
                api.get('/students'),
                api.get('/teachers'),
                api.get('/classes'),
                api.get('./transport/route'),
                api.get('/fees'),
                api.get('/attendance/status'),
            ]);

            const students = studentsRes.data;
            const teachers = teachersRes.data;
            const classes = classesRes.data;
            const routes = routesRes.data;
            const fees = feesRes.data;
            const attendance = attendanceRes.data;
            
            const pendingFeesTotal = fees
                .filter((fee: any) => fee.status === 'pending' || fee.status === 'partial')
                .reduce((sum: number, fee: any) => sum + (fee.totalAmount - fee.paidAmount),0);
                
            const avgAttendanceRate = attendance.averageRate || 0;

            setStats({
                totalStudents: students.length,
                totalTeachers: teachers.length,
                attendanceRate: avgAttendanceRate,
                pendingFees: pendingFeesTotal,
                totalClasses: classes.length,
                activeRoutes: routes.length,
            });
            if(attendance.dailyStats){
                setAttendanceData(attendance.dailyStats.slice(-7));
            }

            const feeStatusData = [
                {
                    status: 'Paid',
                    amount: fees.filter((f: any) => f.status === 'paid').reduce((sum: number, f: any) => sum + f.totalAmount, 0),
                    count: fees.filter((f: any) => f.status === 'paid').length,
                },
                {
                    status: 'Pending',
                    amount: fees.filter((f: any) => f.status === 'pending').reduce((sum: number, f: any) => sum + f.totalAmount, 0),
                    count: fees.filter((f: any) => f.status === 'pending').length,
                },
                {
                    status: 'Partial',
                    amount: fees.filter((f: any) => f.status === 'partial').reduce((sum: number, f: any) => sum + f.totalAmount, 0),
                    count: fees.filter((f: any) => f.status === 'partial').length,
                },
            ];
            setFeeData(feeStatusData);
        }catch(error: any){
            console.error('Error fetching dashboard data:', error);
            toast.error(error.response?.data?.message || 'Failed to load dashboard data');
        }finally{
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: 'Total Students',
            value: stats.totalStudents.toLocaleString(),
            icon: Users,
            color: 'bg-blue-500',
            trend: '+12%',
            trendUp: true,
        },
        {
            label: 'Total Teachers',
            value: stats.totalTeachers.toLocaleString(),
            icon: GraduationCap,
            color: 'bg-green-500',
            trend: '+5%',
            trendUp: true,
        },
        {
            label: 'Attendance Rate',
            value: `${stats.attendanceRate.toFixed(1)}%`,
            icon: Calendar,
            color: 'bg-Yellow-500',
            trend: stats.attendanceRate >=90 ? '+2%' : '-3%',
            trendUp: stats.attendanceRate >= 90,
        },
        {
            label: 'Pending Fees',
            value: `₹${stats.pendingFees.toLocaleString()}`,
            icon: IndianRupee,
            color: 'bg-Red-500',
            trend: '-8%',
            trendUp: true,
        },
    ];
    
    if (loading) {
        return (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
    }

    return(
        <div className="space-y-6">
            <div className="flex justify-between items center">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                                <div className="flex items-center mt-2">
                                    {stat.trendUp? (
                                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    ):(
                                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                                    )}
                                    <span className={`text-xs ${stat.trendUp? 'text-green-500' : 'text-red-500'}`}>
                                        {stat.trend} from last month
                                    </span>
                                </div>
                            </div>
                            <div className={`${stat.color} text-white p-3 rounded-lg`}>
                                <stat.icon className="w-8 h-8"/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-colls-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Total Classes</span>
                            <span className="font-semibold text-lg">{stats.totalClasses}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Active Routes</span>
                            <span className="font-semibold text-lg">{stats.activeRoutes}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Student-Teacher Ratio</span>
                            <span className="font-semibold text-lg">
                                {stats.totalTeachers > 0 ? Math.round(stats.totalStudents / stats.totalTeachers) :0}:1
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Average Class Size</span>
                            <span className="font-semibold text-lg">
                                {stats.totalClasses > 0 ? Math.round(stats.totalStudents / stats.totalClasses):0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Fee Collection Status</h3>
                <div className="space-y-4">
                    {feeData.map((fee, index)=> (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">{fee.status}</span>
                                <span className="font-semibold">{fee.amount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className={`h-2 rounded-full ${
                                    fee.status === 'Paid' ? 'bg-green-500' :
                                    fee.status === 'Partial' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} style={{
                                    width: `${feeData.reduce((sum, f) => sum + f.amount,0) > 0
                                        ? (fee.amount / feeData.reduce((sum, f) => sum + f.amount, 0)) * 100
                                        : 0}%`
                                }} />
                                <p className="text-xs text-gray-500">{fee.count} fees</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Attendance Trends (Last 7 Days)</h3>
                    <div className="space-y-3">
                        {attendanceData.length > 0 ? (
                            attendanceData.map((day, index) => (
                                <div key={index} className="space-y-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">
                                            {new Date(day.date).toLocaleDateString('en-IN', {month:'short', day: 'numeric'})}
                                        </span>
                                        <span className="font-semibold">{day.rate.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className={`h-2 rounded-full ${day.rate >= 90 ? 'bg-green-500' :
                                            day.rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                        style={{width: `${day.rate}%`}}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs tetx-gray-500">
                                        <span>Present: {day.present}</span>
                                        <span>Absent: {day.absent}</span>
                                    </div>
                                </div>
                            ))
                        ):(
                            <div className="h-48 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>No attendance data available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3>Recent Activities</h3>
                </div>
            </div>
        </div>
    )

};

export default Dashboard;