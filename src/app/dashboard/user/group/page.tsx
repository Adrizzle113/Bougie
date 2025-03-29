// src/app/dashboard/user/group/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  joinedAt: string;
}

const UserGroupsPage: React.FC = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const response = await fetch('/api/user/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data.groups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load groups');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserGroups();
  }, []);

  const handleLeaveGroup = async (groupId: string) => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user/groups/${groupId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to leave group');
      }

      setGroups(prev => prev.filter(group => group.id !== groupId));
    } catch (err) {
      console.error('Error leaving group:', err);
      alert('Failed to leave group');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
        <button
          onClick={() => router.push('/dashboard/user/group')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Join New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">
            You haven&apos;t joined any groups yet. Join a group to start collaborating!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{group.name}</h2>
                <button
                  onClick={() => handleLeaveGroup(group.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Leave
                </button>
              </div>
              
              {group.description && (
                <p className="mt-2 text-gray-600 text-sm">{group.description}</p>
              )}
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>{group.memberCount} members</span>
                <span>Joined {new Date(group.joinedAt).toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => router.push(`/dashboard/user/group/${group.id}`)}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserGroupsPage;