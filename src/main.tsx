
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a class to the root element for proper sizing
const rootElement = document.getElementById("root")!;
rootElement.className = "aspect-16-9"; 

createRoot(rootElement).render(<App />);
