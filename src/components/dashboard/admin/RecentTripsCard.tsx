// src/components/dashboard/admin/RecentTripsCard.tsx
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Eye, PencilIcon } from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  subtitle: string;
}

interface RecentTripsCardProps {
  trips: Trip[];
}

export const RecentTripsCard = ({ trips }: RecentTripsCardProps) => {
  const router = useRouter();

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
        {trips.length > 0 ? (
          <div className="divide-y">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between py-4"
              >
                <div>
                  <p className="font-medium">{trip.title}</p>
                  <p className="text-sm text-gray-500">{trip.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => window.open(`/trips/${trip.id}`, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </button>
                  <button
                    className="inline-flex items-center p-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => router.push(`/admin/trips/edit/${trip.id}`)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">No recent trips</p>
        )}
      </div>
    </Card>
  );
};