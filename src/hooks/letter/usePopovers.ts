
import { useState } from 'react';

export function usePopovers() {
  // Popovers state
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [stylePopoverOpen, setStylePopoverOpen] = useState(false);
  const [paperStylePopoverOpen, setPaperStylePopoverOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  const insertLink = (url: string) => {
    if (!url) return;

    // Simple URL validation
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      finalUrl = `https://${url}`;
    }

    try {
      document.execCommand('createLink', false, finalUrl);
      
      // Reset link fields
      setLinkText('');
      setLinkUrl('');
      setLinkPopoverOpen(false);
    } catch (err) {
      console.error('Error inserting link:', err);
    }
  };
  
  return {
    linkPopoverOpen,
    setLinkPopoverOpen,
    linkText,
    setLinkText,
    linkUrl,
    setLinkUrl,
    stylePopoverOpen,
    setStylePopoverOpen,
    paperStylePopoverOpen,
    setPaperStylePopoverOpen,
    colorPickerOpen,
    setColorPickerOpen,
    insertLink
  };
}
