// src/app/dashboard/admin/forms/create/page.tsx
'use client';

import React from 'react';

export default function CreateFormPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Form</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Add your form creation content here */}
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Form Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2"
              placeholder="Enter form name"
            />
          </div>
          {/* Add more form fields as needed */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Form
          </button>
        </form>
      </div>
    </div>
  );
}