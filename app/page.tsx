'use client';

import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  return (
    <div>
      <Head>
        <title>Navigation Links</title>
        <meta name="description" content="Home page with navigation links to Admin and Map with List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to the Navigation Page</h1>
        <p className="text-xl text-gray-700 mb-8">Choose a page to visit:</p>

        <div className="space-y-4">
          {/* Link to the /admin page */}
          <Link href="/admin" className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
           
              Go to Admin Page
          
          </Link>

          {/* Link to the /mapWithList page */}
          <Link href="/mapWithList"className="inline-block bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
>
              Go to Map with List
  
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
