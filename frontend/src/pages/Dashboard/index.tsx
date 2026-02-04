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
          <div className="flex item-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        );
    }

    return(
        <div className="flex"></div>
    )

};

export default Dashboard;