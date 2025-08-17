const XLSX = require('xlsx');

try {
  console.log('=== DEEP STRUCTURE ANALYSIS ===\n');
  const workbook = XLSX.readFile('/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY.xlsx');
  
  console.log('📋 All Sheets:', workbook.SheetNames);
  
  // Analyze each sheet
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== SHEET: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`Rows: ${jsonData.length}`);
    if (jsonData.length > 0) {
      console.log('Headers (Row 2):', jsonData[1]);
      
      // Show sample data with all columns
      console.log('\nSample entries with ALL columns:');
      jsonData.slice(2, 8).forEach((row, index) => {
        if (row && row.length > 0) {
          console.log(`\nEntry ${index + 1}:`);
          if (jsonData[1]) {
            jsonData[1].forEach((header, colIndex) => {
              if (row[colIndex] !== undefined && row[colIndex] !== '') {
                console.log(`  ${header}: ${row[colIndex]}`);
              }
            });
          }
        }
      });
      
      // Look for location patterns in ĐỊA ĐIỂM column (index 8)
      console.log('\nAll unique ĐỊA ĐIỂM values:');
      const locations = new Set();
      jsonData.slice(2).forEach(row => {
        if (row && row[8] && row[8] !== '') {
          locations.add(row[8]);
        }
      });
      
      [...locations].forEach((loc, i) => {
        console.log(`${i + 1}. ${loc}`);
      });
    }
  });
  
} catch (error) {
  console.error('Error:', error.message);
}
