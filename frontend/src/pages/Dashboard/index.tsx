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