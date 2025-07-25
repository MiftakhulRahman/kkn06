export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Test Tailwind CSS
        </h1>
        <p className="text-gray-600 mb-4">
          Jika Anda melihat teks ini dengan styling, berarti Tailwind CSS sudah bekerja!
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Test Button
        </button>
      </div>
    </div>
  )
} 