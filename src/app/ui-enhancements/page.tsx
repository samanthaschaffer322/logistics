'use client';

import React from 'react';
import EnhancedUIUXImprovements from '@/components/EnhancedUIUXImprovements';

export default function UIEnhancementsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Enhanced UI/UX Improvements
        </h1>
        <p className="text-gray-600">
          Advanced user interface and experience enhancements with accessibility features and theme management
        </p>
      </div>
      
      <EnhancedUIUXImprovements />
    </div>
  );
}
