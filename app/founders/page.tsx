import AboutFoundersPage, { metadata as aboutMetadata } from '../about/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...aboutMetadata,
  title: 'Founders of Nexora | Shaik Nadeem Ahmed & Gudipalli Rakesh Varma',
  alternates: {
    canonical: 'https://www.nexoraedu.co.in/founders',
  },
};

export default AboutFoundersPage;
