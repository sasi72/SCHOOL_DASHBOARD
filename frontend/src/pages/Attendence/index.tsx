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

    const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
        const newAttendance = new Map(attendance);
        newAttendance.set(studentId, status);
        setAttendance(newAttendance);
        calculateStats(newAttendance);
    };

    const markAllPresent = () => {
        const newAttendance = new Map<string, string>();
        students.forEach((student: Student)=> newAttendance.set(student._id, 'present'));
        setAttendance(newAttendance);
        calculateStats(newAttendance);
    };

    const submitAttendance = async () => {
        if(!selectedClass){
            toast.error('Please select a class');
            return;
        }

        setLoading(true);
        try {
            const attendanceRecords = students.map((student: Student) => ({
                studentId: student._id,
                classId: selectedClass,
                date: selectedDate,
                status: attendance.get(student._id) || 'absent',
            }));

            await api.post('/attendance',{attendanceRecords});
            toast.success('Attendance submitted successfully');
            fetchAttendance()
        } catch(error : any){
            toast.error(error.response?.data?.message || 'Failed to submit attendance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl find-bold text-gray-900">Attendance Management</h1>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center hover:bg-gray-700">
                        <Download className="w-4 h-4 mr-2" />Export Report
                    </button>
                    <button 
                        onClick={submitAttendance}
                        disabled={loading || !selectedClass}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Attendance'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Present</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">{stats.present}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div> 
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex item-center justify-between">
                    <div>
                        <p className="test-sm text-gray-600">Absent</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{stats.absent}</p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Late</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">{stats.late}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Excused</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.excused}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                    </div>
                </div>
            </div>
            
            
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="">Selected Class</option>
                            {classes.map((cls) => (
                                <option key={cls._id} value={cls._id}>
                                    {cls.name} - Grade {cls.grade} ({cls.section})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={markAllPresent}
                            disabled={!selectedClass}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                            Mark All Present
                        </button>
                    </div>
                </div>
            </div>

            {selectedClass && (
                <div className="bg-white rounded-lg shadow" >
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">Student Attendance</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</tr>
                                <tr className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</tr>
                                <tr className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</tr>
                                <tr className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{student.rollNumber}</td>
                                        <td className="px-6 py-4">{student.firstName} {student.lastName}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                                                attendance.get(student._id) === 'present' ? 'bg-green-100 text-green-800' :
                                                attendance.get(student._id) === 'absent' ? 'bg-red-100 text-red-800' :
                                                attendance.get(student._id) === 'late' ? 'bg-yellow-100 text-yellow-800' :
                                                attendance.get(student._id) === 'excused' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`} >
                                                {attendance.get(student._id) || 'Not Marked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center space-x-2">
                                                {(['present','absent','late','excused'] as const).map((status) =>(
                                                    <button
                                                        key={status}
                                                        onClick={()=> markAttendance(student._id, status)}
                                                        className={`px-3 py-1 rounded capitalize tezt-sm ${
                                                            attendance.get(student._id) === status
                                                            ? status === 'present' ? 'bg-green-600 text-white'
                                                            : status === 'absent' ? 'bg-red-600 text-white'
                                                            : status === 'late' ? 'bg-yellow-600 text-white'
                                                            : 'bg-blue-600 text-white'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendence;