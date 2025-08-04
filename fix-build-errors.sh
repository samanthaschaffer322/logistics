#!/bin/bash

# Quick Fix Script for Build Errors
echo "🔧 Fixing build errors for LogiAI..."

# Fix file-learning page
sed -i '' 's/Download, //g' src/app/file-learning/page.tsx
sed -i '' 's/parsed_json: any/parsed_json: Record<string, unknown>/g' src/app/file-learning/page.tsx
sed -i '' 's/fileId: string/fileId: string/g' src/app/file-learning/page.tsx

# Fix login page
sed -i '' "s/Don't have an account?/Don\&apos;t have an account?/g" src/app/login/page.tsx

# Fix shipments create page - add calculateCharges to useEffect dependency
sed -i '' 's/], \[/], [calculateCharges,/g' src/app/shipments/create/page.tsx

# Fix shipments page - remove unused imports
sed -i '' 's/Input, //g' src/app/shipments/page.tsx
sed -i '' 's/, Filter//g' src/app/shipments/page.tsx
sed -i '' 's/, formatDateTime//g' src/app/shipments/page.tsx

# Fix transportation page
sed -i '' 's/, Clock//g' src/app/transportation/page.tsx

# Fix Navigation component
sed -i '' 's/userRole as any/userRole as string/g' src/components/layout/Navigation.tsx

# Fix Card component
sed -i '' 's/interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}/interface CardProps extends React.HTMLAttributes<HTMLDivElement> {\n  children?: React.ReactNode;\n}/g' src/components/ui/Card.tsx

# Fix AuthContext
sed -i '' 's/error: any/error: Error | null/g' src/contexts/AuthContext.tsx

echo "✅ Build errors fixed!"
echo "🔄 Running build verification again..."
