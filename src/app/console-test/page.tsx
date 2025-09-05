'use client'

// IMMEDIATE CONSOLE TEST - 2025-09-05T08:12:04.977+07:00
console.log('🔥 CONSOLE TEST WORKING!')
console.log('✅ JavaScript is loading!')
console.log('📊 Cache: 20250905081204')

export default function ConsoleTest() {
  console.log('🎯 COMPONENT RENDERED!')
  
  return (
    <div className="min-h-screen bg-red-500 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl">
        <h1 className="text-6xl font-bold text-red-600 mb-4">
          🔥 CONSOLE TEST
        </h1>
        <p className="text-2xl text-gray-800 mb-4">
          Cache: 20250905081204
        </p>
        <p className="text-xl text-gray-600">
          If you can see this page, check the console (F12) for logs!
        </p>
        <button 
          onClick={() => {
            console.log('🔥 BUTTON CLICKED!')
            alert('Button works! Check console!')
          }}
          className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-xl mt-4"
        >
          🔥 TEST BUTTON
        </button>
      </div>
    </div>
  )
}
