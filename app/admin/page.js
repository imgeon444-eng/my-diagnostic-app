import React from 'react';
import KanbanBoard from '../../components/admin/KanbanBoard';
import B2BTargetSniperAnalyzer from '../../components/admin/B2BTargetSniperAnalyzer';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <B2BTargetSniperAnalyzer />
        <KanbanBoard />
      </div>
    </div>
  );
}