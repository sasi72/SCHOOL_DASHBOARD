import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Users, GraduationCap, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

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
    const [ lloading, setLoading ] = useState(true);
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
                
        }catch(error: any){
            console.error('Error fetching dashboard data:', error);
            toast.error(error.response?.data?.message || 'Failed to load dashboard data');
        }finally{
            setLoading(false);
        }
    }
};

export default Dashboard;