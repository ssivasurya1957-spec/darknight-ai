import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, message, title } = body;

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

    if (accountSid && authToken) {
      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const recipient = to ? (to.startsWith('whatsapp:') ? to : `whatsapp:${to}`) : 'whatsapp:+1234567890';
      
      const formData = new URLSearchParams();
      formData.append('From', fromNumber);
      formData.append('To', recipient);
      formData.append('Body', `🦇 *DarkKnight AI Alert*\n\n*${title || 'Notification'}*\n${message}`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Twilio WhatsApp dispatch failed');
      }

      return NextResponse.json({ success: true, mode: 'twilio', data });
    }

    // Direct WhatsApp API / Webhook fallback response
    const formattedText = encodeURIComponent(`🦇 *DarkKnight AI Alert*\n\n*${title || 'Notification'}*\n${message}`);
    const whatsappWebUrl = `https://api.whatsapp.com/send?text=${formattedText}`;

    return NextResponse.json({
      success: true,
      mode: 'direct_link',
      whatsappUrl: whatsappWebUrl,
      message: 'WhatsApp notification payload generated. Ready for dispatch.',
    });
  } catch (error) {
    console.error('WhatsApp Dispatch Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to dispatch WhatsApp message' },
      { status: 500 }
    );
  }
}
