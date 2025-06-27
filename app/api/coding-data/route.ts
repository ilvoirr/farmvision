import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'coding-data.json');

// Ensure data file exists and is initialized
await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
const fileExists = await fs.access(DATA_FILE).then(() => true).catch(() => false);
if (!fileExists) {
  await fs.writeFile(DATA_FILE, '{}');
}

export async function POST(request: NextRequest) {
  try {
    // Get Clerk session from request
    const { userId } = await getAuth({
      headers: request.headers,
      cookies: await cookies()
    });
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { expectations, coded } = body;

    // Get existing data for the user
    const existingData = await getSavedData();
    const userEntries = existingData[userId] || [];

    // Add new entry
    const newData = [...userEntries, { userId, expectations, coded, timestamp: new Date().toISOString() }];

    // Save updated data
    await saveData({ [userId]: newData });

    return NextResponse.json({ success: true, data: newData });
  } catch (error: any) {
    console.error('Error saving data:', error);
    return NextResponse.json({ error: error.message || 'Failed to save data' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get Clerk session from request
    const { userId } = await getAuth({
      headers: request.headers,
      cookies: await cookies()
    });
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await getSavedData();
    const userEntries = data[userId] || [];
    return NextResponse.json({ data: userEntries });
  } catch (error: any) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
  }
}

// Helper functions for data storage
async function getSavedData(): Promise<Record<string, any[]>> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return {};
  }
}

async function saveData(data: Record<string, any[]>): Promise<void> {
  try {
    const dataString = JSON.stringify(data, null, 2);
    await fs.writeFile(DATA_FILE, dataString);
  } catch (error) {
    console.error('Error saving data:', error);
    throw new Error('Failed to save data');
  }
}
