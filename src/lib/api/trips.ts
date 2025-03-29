// src/lib/api/trips.ts
import { notFound } from 'next/navigation';

export async function getTripById(id: string) {
  try {
    const response = await fetch(`/api/trips/${id}`);
    if (!response.ok) {
      notFound();
    }
    return response.json();
  } catch (error) {
    notFound();
  }
}