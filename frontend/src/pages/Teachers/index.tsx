import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Filter} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Teacher, Subject, Class } from '../../types';

const Teachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teachers[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedTeachers, setSelectedTeachers] = useState<Teachers | null>(null);
    const [fromData, setFormData] = useState({
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        addredd: '',
        dateOfBirth: '',
        gender: '',
        qualification: '',
        subject: [] as string[],
        classes: [] as string[],
        joiningDate: '',
        salary: '',
        imageUrl: '',
    });

}

export default Teachers;