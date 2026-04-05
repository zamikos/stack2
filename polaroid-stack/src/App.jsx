import { useState } from 'react';
import PolaroidStack from './PolaroidStack.jsx';
import ScrollingPhotoStack from './ScrollingPhotoStack.jsx';
import './AppNav.css';

export default function App() {
  const [page, setPage] = useState('polaroid');

  return (
    <>
      {/* Floating page switcher */}
      <nav className="app-nav">
        <button
          className={`app-nav-btn ${page === 'polaroid' ? 'active' : ''}`}
          onClick={() => {
            setPage('polaroid');
            window.scrollTo({ top: 0 });
          }}
        >
          Memories
        </button>
        <button
          className={`app-nav-btn ${page === 'scrolling' ? 'active' : ''}`}
          onClick={() => {
            setPage('scrolling');
            window.scrollTo({ top: 0 });
          }}
        >
          MemoryStack
        </button>
      </nav>

      {page === 'polaroid' ? <PolaroidStack /> : <ScrollingPhotoStack />}
    </>
  );
}
