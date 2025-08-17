const XLSX = require('xlsx');

// Analyze multiple files to understand patterns
const files = [
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (1).xlsx',
  '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY.xlsx'
];

files.forEach(filePath => {
  try {
    console.log(`\n=== ANALYZING: ${filePath} ===`);
    const workbook = XLSX.readFile(filePath);
    
    // Focus on the logistics tracking sheet
    const trackingSheet = workbook.Sheets['THEO DÕI '] || workbook.Sheets['THEO DÕI'];
    if (trackingSheet) {
      const data = XLSX.utils.sheet_to_json(trackingSheet, { header: 1 });
      
      console.log('LOGISTICS DATA STRUCTURE:');
      console.log('Headers:', data[1]); // Row 2 has headers
      
      console.log('\nSAMPLE LOGISTICS ENTRIES:');
      data.slice(2, 8).forEach((row, index) => {
        if (row && row.length > 8) {
          console.log(`Entry ${index + 1}:`, {
            date: row[1],
            vehicle: row[2],
            container: row[5],
            customer: row[7],
            location: row[8],
            time: row[9],
            status: row[10],
            bill: row[11],
            port: row[12]
          });
        }
      });
      
      // Extract unique locations
      const locations = data.slice(2).map(row => row[8]).filter(Boolean);
      const uniqueLocations = [...new Set(locations)];
      console.log('\nUNIQUE LOCATIONS FOUND:', uniqueLocations);
      
      // Extract customers
      const customers = data.slice(2).map(row => row[7]).filter(Boolean);
      const uniqueCustomers = [...new Set(customers)];
      console.log('\nUNIQUE CUSTOMERS:', uniqueCustomers);
      
      // Extract vehicle patterns
      const vehicles = data.slice(2).map(row => row[2]).filter(Boolean);
      const uniqueVehicles = [...new Set(vehicles)];
      console.log('\nVEHICLE PATTERNS:', uniqueVehicles.slice(0, 10));
    }
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
  }
});
