export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
}

export enum UserRole {
    SUPER_ADMIN = 'superadmin',
    PRINCIPAL = 'principal',
    TEACHER = 'teacher',
    STUDENT = 'student',
    PARENT = 'parent',
}

export interface Student {
    _id: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    email?: string;
    address: string;
    phone?: string;
    imageUrl?: string;
    classId: Class;
    parentId?: User;
    admissionDate: string;
    bloodgroup?: string;
    medicalConditions?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Teacher {
    _id: string;
    userId: User;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    qualification: string;
    subjects: Subject[];
    classes: Class[];
    joiningDate: string;
    salary: number;
    isActive: boolean;
}

export interface Class {
    _id: string;
    name: string;
    grade: number;
    section: string;
    classTeacher: Teacher;
    acedemicYear: string;
    capacity: number;
    room?: string;
    isActive: boolean;
}

export interface Subject {
    _id: string;
    name: string;
    code: string;
    description?: string;
    credits: number;
    grade: number;
    isActive: boolean;
}

