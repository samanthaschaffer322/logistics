'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import EnhancedImportExportCenter from '@/components/EnhancedImportExportCenter';

export default function ImportExportPage() {
  return (
    <ProtectedRoute>
      <EnhancedImportExportCenter />
    </ProtectedRoute>
  );
}
