import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Edit2, Plus } from 'lucide-react';

interface Subject {
    id: string;
    name: string;
    maxMarks: number;
}

interface Grade {
    subjectId: string;
    marks: number;
    grade: string;
}

interface Student {
    id: string;
    name: string;
    rollNumber: string;
    class: string;
    section: string;
    grades: Grade[];
    totalMarks: number;
    percentage: number;
    overallGrade: string;
}