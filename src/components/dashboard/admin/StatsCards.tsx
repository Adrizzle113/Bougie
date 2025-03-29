// src/components/dashboard/admin/StatsCards.tsx
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalTrips: number;
    activeTrips: number;
    draftTrips: number;
    publishedTrips: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Total Trips</h3>
          <p className="text-2xl font-bold">{stats.totalTrips}</p>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Active Trips</h3>
          <p className="text-2xl font-bold text-green-600">{stats.activeTrips}</p>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Draft Trips</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.draftTrips}</p>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Published Trips</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.publishedTrips}</p>
        </div>
      </Card>
    </div>
  );
};