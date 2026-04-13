import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function requireAdmin(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null; // No error, user is authenticated
}

