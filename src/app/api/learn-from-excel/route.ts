export const dynamic = 'force-static';
export const revalidate = false;

import { NextRequest, NextResponse } from 'next/server';
import { LogisticsAI } from '@/lib/ai-learning/logistics-ai';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filePaths, openaiApiKey } = await request.json();

    if (!filePaths || !Array.isArray(filePaths)) {
      return NextResponse.json(
        { error: 'File paths array is required' },
        { status: 400 }
      );
    }

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      );
    }

    const logisticsAI = new LogisticsAI(openaiApiKey);

    // Process each Excel file
    const processedFiles = [];
    const errors = [];

    for (const filePath of filePaths) {
      try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          errors.push(`File not found: ${filePath}`);
          continue;
        }

        // Read and process the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        processedFiles.push({
          filePath,
          recordCount: jsonData.length,
          sheetName,
          columns: Object.keys(jsonData[0] || {})
        });

      } catch (error) {
        errors.push(`Error processing ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Learn from the files
    await logisticsAI.learnFromExcelFiles(filePaths.filter(fp => fs.existsSync(fp)));

    // Generate sample predictions
    const prediction = await logisticsAI.generatePredictions(
      new Date().toISOString().split('T')[0],
      {
        origin: 'Cảng Sài Gòn',
        destination: 'Bình Dương',
        containerType: '40ft',
        urgency: 'medium'
      }
    );

    // Get learned patterns
    const patterns = logisticsAI.getLearnedPatterns();
    const historicalData = logisticsAI.getHistoricalData();

    return NextResponse.json({
      success: true,
      processedFiles,
      errors,
      learningResults: {
        totalRecords: historicalData.length,
        totalPatterns: patterns.length,
        patterns: patterns.slice(0, 5), // Return first 5 patterns
        prediction
      }
    });

  } catch (error) {
    console.error('Error in learn-from-excel API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Excel learning API endpoint',
    usage: 'POST with filePaths array and openaiApiKey'
  });
}
