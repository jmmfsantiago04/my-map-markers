import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamically import the Map component to prevent SSR issues
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const Home = () => {
  return (
    <div>
      <Head>
        <title>Google Maps with Marker Clusters and InfoWindows (TypeScript)</title>
        <meta name="description" content="Google Maps Marker Clustering and InfoWindows in Next.js 14 with TypeScript" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Google Maps with Marker Clusters and InfoWindows</h1>
        <Map />
      </main>
    </div>
  );
};

export default Home;
