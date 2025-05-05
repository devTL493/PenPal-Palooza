
import { useState, useEffect } from 'react';

export function useColorPalette() {
  // Color palette groups
  const colorPalette = {
    grays: ['#000000', '#333333', '#555555', '#777777', '#999999', '#BBBBBB', '#DDDDDD', '#F5F5F5'],
    reds: ['#7F0000', '#9A0000', '#B71C1C', '#D32F2F', '#F44336', '#E57373', '#FFCDD2', '#FFEBEE'],
    blues: ['#0D47A1', '#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9', '#BBDEFB', '#E3F2FD'],
    greens: ['#1B5E20', '#388E3C', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#E8F5E9'],
    oranges: ['#E65100', '#F57C00', '#FF9800', '#FFB74D', '#FFCC80', '#FFE0B2', '#FFF3E0', '#FFF8E1'],
    yellows: ['#F57F17', '#FBC02D', '#FFEB3B', '#FFF176', '#FFF59D', '#FFF9C4', '#FFFDE7', '#FFFDE7'],
    purples: ['#4A148C', '#7B1FA2', '#9C27B0', '#AB47BC', '#BA68C8', '#CE93D8', '#E1BEE7', '#F3E5F5'],
  };
  
  // Flatten color palette for the grid 
  const flattenedPalette = Object.values(colorPalette).flat();
  
  return {
    colorPalette,
    flattenedPalette
  };
}
