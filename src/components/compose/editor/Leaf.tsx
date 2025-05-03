
import React from 'react';

interface LeafProps {
  attributes: any;
  children: React.ReactNode;
  leaf: any;
}

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  let el = children;
  
  if (leaf.bold) {
    el = <strong>{el}</strong>;
  }
  
  if (leaf.italic) {
    el = <em>{el}</em>;
  }
  
  if (leaf.underline) {
    el = <u>{el}</u>;
  }
  
  if (leaf.color) {
    el = <span style={{ color: leaf.color }}>{el}</span>;
  }

  // New styling options
  const style: React.CSSProperties = {};

  if (leaf.fontFamily) {
    switch (leaf.fontFamily) {
      case 'serif':
        style.fontFamily = 'Georgia, Times New Roman, serif';
        break;
      case 'sans':
        style.fontFamily = 'Arial, Helvetica, sans-serif';
        break;
      case 'mono':
        style.fontFamily = '"Courier Prime", "Courier New", monospace';
        break;
      case 'georgia':
        style.fontFamily = 'Georgia, serif';
        break;
      case 'merriweather':
        style.fontFamily = 'Merriweather, Georgia, serif';
        break;
      default:
        style.fontFamily = leaf.fontFamily;
    }
  }
  
  if (leaf.fontSize) {
    style.fontSize = leaf.fontSize;
  }
  
  if (leaf.lineHeight) {
    style.lineHeight = leaf.lineHeight;
  }
  
  return <span {...attributes} style={style}>{el}</span>;
};

export default Leaf;
