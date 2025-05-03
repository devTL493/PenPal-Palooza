
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
  
  return <span {...attributes}>{el}</span>;
};

export default Leaf;
