export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-IN',{
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-IN',{
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const calculateAge = (dateOfBirth: string | Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    //Date of birth Passed or not check
    if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())){
        age--;
    }
    return age;
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN',{
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const downloadBlob = (blob: Blob, fileName: string): void => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const exportToCSV = (data: any[], filename: string): void => {
    if (data.length === 0) return;

    const header = Object.keys(data[0]);
    const csvContent = [
        header.join(','),
        ...data.map((row) => header.map((header) => JSON.stringify(row[header] || '')).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    downloadBlob(blob, filename)
};