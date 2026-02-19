import React, {useState, useEffect} from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import {Student, Class} from '../../types';

const Students: React.FC = () => {
    const [students, setStudents ] = useState<Student[]>([]);
    const [classes, setClasses ] = useState<Class[]>([]);
    const [loading, setLoading ] = useState(false);
    const [searchterm, setSearchterm ] = useState('');
    const [selectedClass, setSelectedClass ] = useState('');
    const [showModal, setShowModal ] = useState(false));
    const [selectedStudents, setSelectedStudents ] = useState<Student | null>(null);
    const [fromData, setFormData ] = useState({
        rollNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        classId: '',
        bloodGroup: '',
        medicalConditions: '',
    });
}

export default Students;