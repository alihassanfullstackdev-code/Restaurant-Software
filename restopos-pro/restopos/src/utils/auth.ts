// src/utils/auth.ts
export const can = (slug: string): boolean => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return false;

    const user = JSON.parse(storedUser);
    // Hum sirf user_permissions table ka data check kar rahe hain
    const permissions = user.permissions || [];

    return permissions.some((p: any) => p.slug === slug);
};