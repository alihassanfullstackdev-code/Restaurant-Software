export const hasPermission = (permissionSlug: string) => {
    const userString = localStorage.getItem('user'); // Ya jahan bhi aapne user save kiya hai
    if (!userString) return false;

    const user = JSON.parse(userString);
    
    // User ki direct permissions aur Role ki permissions dono check karein
    const allPermissions = [
        ...(user.permissions || []).map((p: any) => p.slug),
        ...(user.role?.permissions || []).map((p: any) => p.slug)
    ];

    return allPermissions.includes(permissionSlug);
};