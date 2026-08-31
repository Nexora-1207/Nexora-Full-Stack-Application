import { NextResponse } from 'next/server';
import { MOCK_COLLEGES } from '@/lib/data';
import { SECTOR_TREES } from '@/lib/sectorTrees';

export async function GET() {
  const host = 'www.nexoraedu.co.in';
  const key = 'c79f06df538e45dc9672722b51280829';
  const keyLocation = `https://${host}/${key}.txt`;
  
  const staticUrls = [
    `https://${host}/`,
    `https://${host}/colleges`,
    `https://${host}/sectors`,
    `https://${host}/ai`,
  ];

  const collegeUrls = MOCK_COLLEGES.map((c) => `https://${host}/colleges/${c.id}`);
  const sectorUrls = Object.keys(SECTOR_TREES).map((sKey) => `https://${host}/sectors/${sKey}`);

  const urlList = [...staticUrls, ...collegeUrls, ...sectorUrls];

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
      service: 'IndexNow (Microsoft Bing / Yahoo / Yandex / Seznam)',
      status: response.status,
      response: data || 'All public college, sector, and core URLs submitted successfully',
      urlsSubmittedCount: urlList.length,
      submittedUrls: urlList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
