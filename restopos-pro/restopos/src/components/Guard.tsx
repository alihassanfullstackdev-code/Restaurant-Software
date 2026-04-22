import React from 'react';

interface GuardProps {
    permission: string;
    children: React.ReactNode;
}

export const Guard: React.FC<GuardProps> = ({ permission, children }) => {
    // LocalStorage se user uthayein
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;

    const user = JSON.parse(storedUser);
    const permissions = user.permissions || [];

    // Check karein ke slug match hota hai ya nahi
    const hasPermission = permissions.some((p: any) => p.slug === permission);

    // Agar permission hai toh bache (children) dikhao, warna gayab kar do
    return hasPermission ? <>{children}</> : null;
};