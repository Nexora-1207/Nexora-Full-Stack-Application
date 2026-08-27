import { NextResponse } from 'next/server';

export async function GET() {
  const host = 'www.nexoraedu.co.in';
  const key = 'c79f06df538e45dc9672722b51280829';
  const keyLocation = `https://${host}/${key}.txt`;
  
  const urlList = [
    `https://${host}/`,
    `https://${host}/dashboard`,
    `https://${host}/sectors`,
    `https://${host}/colleges`,
    `https://${host}/ai`,
    `https://${host}/vault`,
    `https://${host}/profile`,
    `https://${host}/auth`,
  ];

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    const data = await response.text();

    return NextResponse.json({
      success: true,
      service: 'IndexNow (Microsoft Bing / Yahoo / Yandex)',
      status: response.status,
      response: data || 'URLs submitted successfully',
      urlsSubmitted: urlList.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
