// Centralized exports for all UI components
// This ensures consistent imports across the application

// Button component
export { Button, buttonVariants } from './button'
export type { ButtonProps } from './button'

// Card components
export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from './card'

// Input component
export { Input } from './input'
export type { InputProps } from './input'

// Label component
export { Label } from './label'

// Badge component
export { Badge, badgeVariants } from './badge'
export type { BadgeProps } from './badge'

// Progress component
export { Progress } from './progress'

// Alert components
export { Alert, AlertTitle, AlertDescription } from './alert'

// Select components
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select'

// Tabs components
export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from './tabs'
