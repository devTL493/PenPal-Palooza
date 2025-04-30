
import { FontOption, FontSizeOption, ColorOption, PaperStyleOption, BorderStyleOption } from '@/types/letter';

// Font options
export const fontOptions: FontOption[] = [
  { label: 'Serif', value: 'font-serif' },
  { label: 'Sans-serif', value: 'font-sans' },
  { label: 'Monospace', value: 'font-mono' },
];

// Font size options
export const fontSizeOptions: FontSizeOption[] = [
  { label: 'Small', value: 'text-sm' },
  { label: 'Normal', value: 'text-base' },
  { label: 'Large', value: 'text-lg' },
  { label: 'Extra Large', value: 'text-xl' },
];

// Color options
export const colorOptions: ColorOption[] = [
  { label: 'Black', value: 'text-black', color: '#000000' },
  { label: 'Gray', value: 'text-gray-600', color: '#4B5563' },
  { label: 'Red', value: 'text-red-600', color: '#DC2626' },
  { label: 'Blue', value: 'text-blue-600', color: '#2563EB' },
  { label: 'Green', value: 'text-green-600', color: '#059669' },
];

// Paper style options
export const paperStyleOptions: PaperStyleOption[] = [
  { label: 'Plain White', value: 'bg-white', description: 'Clean white background' },
  { label: 'Cream Paper', value: 'bg-amber-50', description: 'Warm cream colored paper' },
  { label: 'Light Blue', value: 'bg-blue-50', description: 'Subtle blue tinted paper' },
  { label: 'Light Green', value: 'bg-green-50', description: 'Soft green background' },
  { label: 'Light Pink', value: 'bg-pink-50', description: 'Gentle pink colored paper' },
  { label: 'Vintage Yellow', value: 'bg-yellow-100', description: 'Aged yellow paper look' },
  { label: 'Soft Gray', value: 'bg-gray-100', description: 'Neutral gray background' },
  { label: 'Parchment', value: 'bg-amber-100', description: 'Classic parchment appearance' },
];

// Border style options
export const borderStyleOptions: BorderStyleOption[] = [
  { label: 'No Border', value: 'border-none', description: 'Clean edge without border' },
  { label: 'Simple Border', value: 'border-2 border-gray-200', description: 'Basic thin border' },
  { label: 'Elegant Border', value: 'border-4 border-double border-gray-300', description: 'Double-line decorative border' },
  { label: 'Bold Border', value: 'border-4 border-gray-400', description: 'Thick prominent border' },
  { label: 'Decorative Border', value: 'border-4 border-dashed border-gray-300', description: 'Stylish dashed pattern border' },
];
