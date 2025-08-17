const XLSX = require('xlsx');
const fs = require('fs');

// Read the Excel file
const filePath = '/Users/aelitapham/Downloads/KẾ HOẠCH NGÀY (1).xlsx';

try {
  const workbook = XLSX.readFile(filePath);
  console.log('Sheet Names:', workbook.SheetNames);
  
  // Analyze each sheet
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\n=== Sheet: ${sheetName} ===`);
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log('First 10 rows:');
    jsonData.slice(0, 10).forEach((row, index) => {
      console.log(`Row ${index + 1}:`, row);
    });
    
    // Get column headers
    if (jsonData.length > 0) {
      console.log('\nColumn Headers:', jsonData[0]);
    }
  });
} catch (error) {
  console.error('Error reading file:', error.message);
}
