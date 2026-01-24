import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, XCircle, Clock, Users} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Attendance as AttendanceType, Class, Student } from '../../types';

const Attendence: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [attendance, setAttendance] = useState<Map<string, string>>(new Map());
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, excused: 0 });

    useEffect(() => {
        fetchClasses();
    },[]);

    useEffect(() => {
        fetchStudents();
        fetchAttendance();
    }, [selectedClass, selectedDate]);

    const fetchClasses = async () => {
        try{
            const response = await api.get('/academic/classes');
            setClasses(response.data.data.classes || []);
        } catch (error){
            toast.error('Failed to fetch classes');
        }
    };

    const fetchStudents = async () => {
        try{
            const response = await api.get(`/students?classId=${selectedClass}&limit=100`);
            setStudents(response.data.data.students || []);
        } catch (error){
            toast.error('Failed to fetch students');
        }
    };

    const fetchAttendance = async () => {
        try{
            const response = await api.get(`/attendance?classId=${selectedClass}&stateDate=${selectedDate}&endDate=${selectedDate}`);
            const records = response.data.data.attendace || [];
            const map = new Map<string, string>();
            records.forEach((record: AttendanceType)=>{
                map.set(record.studentId._id, record.status);
            });
            setAttendance(map);
            calculateStats(map);
        } catch(error){
            toast.error('Failed to fetch attendance records')
        }
    };

    const calculateStats = (attendanceMap: Map<string, string> ) => {
        const stats = {present: 0, absent: 0, late: 0, excused: 0};
        attendanceMap.forEach((status)=>{
            if(status === "present") stats.present++;
            if(status === "absent") stats.absent++;
            if(status === "late") stats.late++;
            if(status === "excused") stats.excused++
        });
        setStats(stats);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Attendance Tracking</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p>
                    <p>Attendance calender and marking interface will be implemented here.</p>
                </p>
            </div>
        </div>
    );
};

export default Attendence;