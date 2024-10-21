import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
         
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800">
        Rule Engine with AST
      </h1>
      <div className="space-y-4">
        <Link href="/create-rule" className="block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition duration-300">
          
            Create Rule
          
        </Link>
        <Link href="/evaluate-rule" className="block bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition duration-300">
          
            Evaluate Rule
          
        </Link>
      </div>
      </div>
    
  );
}
