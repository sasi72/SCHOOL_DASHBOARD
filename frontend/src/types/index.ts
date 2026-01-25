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
    imageUrl?: string;
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

export interface Attendance {
    _id: string;
    studentId: Student;
    classId: Class;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    remark?: string;
    markedBy: User;
    createdAt: string;
    updatedAt: string;
}

export interface Grade {
    _id: string;
    studentId: Student;
    subjectId: Subject;
    classId: Class;
    term: string;
    examtype: string;
    marks: number;
    maxMarks: number;
    grade?: string;
    remark?: string;
    acedemicyear: string;
    enteredBy: User;
}

export interface Fee {
    _id: string;
    studentId: Student;
    feeType: string;
    amount: number;
    paidAmount: number;
    dueDate: string;
    paidDate?: string;
    status: 'pending' | 'paid' | 'partially_paid' | 'overdue';
    acedemicYear: string;
    term: string;
    description?: string;
    paymentMethod?: string;
    transactionId?: string;
}

export interface Book {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    category: string;
    quantity: number;
    availableQuantity: number;
    publiser?: string;
    publicationYear?: number;
    shelfLocation: string;
    isActive: boolean;
}

export interface LibraryIssue {
    _id: string;
    bookId: Book;
    studentId: Student;
    issueDate: string;
    dueDate: string;
    returnDate?: string;
    status: 'issued' | 'returned' | 'overdue';
    fine: number;
    finePaid: boolean;
    issuedBy: User;
    remark?: string;
}

export interface TransportRoute {
    _id: string;
    routeNumber: string;
    routeName: string;
    vehicleNumber: string;
    driverName: string;
    driverPhone: string;
    capacity: number;
    pickupPoints: Array<{
        location: string;
        time: string;
    }>;
    fee: number;
    isActive: boolean;
}

export interface TransportAssignment {
    _id: string;
    studentId: Student;
    routeId: TransportRoute;
    pickupPoint: string;
    academicYear: string;
    isActive: boolean;
}

export interface ReportShedule {
    _id: string;
    userId: string;
    reportType: 'grades' | 'fees' | 'library';
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    dayOfWeek?: number;
    dayOdMonth?: number;
    isActive: boolean;
    lastSent?: string;
}