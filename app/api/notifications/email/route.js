import { NextResponse } from 'next/server';
import { sendRealEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, title, message, opportunityTitle, opportunityLink } = body;

    const result = await sendRealEmail({
      to,
      subject,
      title,
      message,
      opportunityTitle,
      opportunityLink,
    });

    return NextResponse.json({
      success: true,
      message: 'Email dispatched successfully via DarkKnight Mail Engine',
      details: result,
    });
  } catch (error) {
    console.error('Email Dispatch Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
