
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactElement }) {
    const { isAdmin, loading } = useAdmin();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-vanta-dark">
                <Loader2 className="w-8 h-8 text-vanta-neon-blue animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}
