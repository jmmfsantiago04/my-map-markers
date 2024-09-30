// /app/actions/markers.ts
'use server';
 import prisma from '@/lib/prisma';
import { z } from 'zod';

// Zod schema for marker validation
const markerSchema = z.object({
  lat: z.number().refine((val) => val >= -90 && val <= 90, {
    message: 'Latitude must be between -90 and 90',
  }),
  lng: z.number().refine((val) => val >= -180 && val <= 180, {
    message: 'Longitude must be between -180 and 180',
  }),
  title: z.string().min(1, { message: 'Title is required' }),
  curiosity: z.string().min(1, { message: 'Curiosity is required' }),
});


export async function addMarker({
  lat,
  lng,
  title,
  curiosity,
}: {
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
}) {
  try {
    markerSchema.parse({ lat, lng, title, curiosity });

    const newMarker = await prisma.marker.create({
      data: { lat, lng, title, curiosity },
    });

    return newMarker;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.issues[0].message}`);
    }
    throw new Error('Error adding marker');
  }
}


export async function getMarkers() {
  try {
    const markers = await prisma.marker.findMany();
    return markers;
  } catch (error) {
    throw new Error('Error fetching markers');
  }
}


export async function editMarker({
  id,
  lat,
  lng,
  title,
  curiosity,
}: {
  id: string;
  lat: number;
  lng: number;
  title: string;
  curiosity: string;
}) {
  try {
    markerSchema.parse({ lat, lng, title, curiosity });

    const updatedMarker = await prisma.marker.update({
      where: { id: Number(id) },
      data: { lat, lng, title, curiosity },
    });

    return updatedMarker;
  } catch (error) {
    throw new Error('Error updating marker');
  }
}


export async function deleteMarker(id: string) {
  try {
    await prisma.marker.delete({
      where: { id: Number(id) },
    });
    return { success: true };
  } catch (error) {
    throw new Error('Error deleting marker');
  }
}
