import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

// Types for a note
/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {number} updatedAt
 */

// Utilities
const uid = () => Math.random().toString(36).slice(2, 9);
const now = () => Date.now();

// Default initial notes
const initialNotes = [
  {
    id: uid(),
    title: 'Welcome to Simple Notes',
    content:
      'This is a lightweight notes app.\n\n- Select a note from the sidebar\n- Create a new note using the + button\n- Edit the title and content\n- Delete a note with the trash icon\n\nYour notes are stored in your browser for this session.',
    updatedAt: now(),
  },
  {
    id: uid(),
    title: 'Minimalistic, light theme',
    content:
      'The app uses a minimal UI with your color scheme:\n- Primary: #1976d2\n- Secondary: #424242\n- Accent: #ffd600',
    updatedAt: now(),
  },
];

// PUBLIC_INTERFACE
function App() {
  /** Persist notes locally in memory (and localStorage for convenience) */
  const [notes, setNotes] = useState(() => {
    try {
      const stored = localStorage.getItem('notes');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return initialNotes;
  });
  const [selectedId, setSelectedId] = useState(() => (initialNotes[0]?.id ?? null));
  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // Save notes to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  // PUBLIC_INTERFACE
  const createNote = () => {
    const newNote = {
      id: uid(),
      title: 'Untitled note',
      content: '',
      updatedAt: now(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  // PUBLIC_INTERFACE
  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (id === selectedId) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedId(remaining[0]?.id || null);
    }
  };

  // PUBLIC_INTERFACE
  const updateNote = (id, patch) => {
    setNotes((prev) =>
      prev
        .map((n) => (n.id === id ? { ...n, ...patch, updatedAt: now() } : n))
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  return (
    <div className="app-root">
      <Header onCreate={createNote} />
      <div className="layout">
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={deleteNote}
          onCreate={createNote}
        />
        <MainArea
          note={selectedNote}
          onChangeTitle={(title) => selectedNote && updateNote(selectedNote.id, { title })}
          onChangeContent={(content) =>
            selectedNote && updateNote(selectedNote.id, { content })
          }
          onDelete={() => selectedNote && deleteNote(selectedNote.id)}
        />
      </div>
    </div>
  );
}

function Header({ onCreate }) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-dot" />
        <span className="brand-name">Simple Notes</span>
      </div>
      <div className="header-actions">
        <button className="btn btn-accent" onClick={onCreate} aria-label="Create note">
          + New
        </button>
      </div>
    </header>
  );
}

function Sidebar({ notes, selectedId, onSelect, onDelete, onCreate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <span className="sidebar-title">Notes</span>
        <button className="icon-btn" onClick={onCreate} aria-label="Add note" title="Add note">
          +
        </button>
      </div>
      <div className="notes-list" role="list">
        {notes.length === 0 ? (
          <div className="empty">No notes yet. Create one!</div>
        ) : (
          notes.map((n) => (
            <button
              key={n.id}
              role="listitem"
              className={`note-list-item ${n.id === selectedId ? 'active' : ''}`}
              onClick={() => onSelect(n.id)}
              title={n.title || 'Untitled'}
            >
              <div className="note-title-row">
                <span className="note-title">{n.title || 'Untitled'}</span>
                <button
                  className="icon-btn danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(n.id);
                  }}
                  title="Delete note"
                  aria-label="Delete note"
                >
                  🗑
                </button>
              </div>
              <span className="note-updated">
                {new Date(n.updatedAt).toLocaleString()}
              </span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

function MainArea({ note, onChangeTitle, onChangeContent, onDelete }) {
  if (!note) {
    return (
      <main className="main">
        <div className="empty-main">Select or create a note to begin.</div>
      </main>
    );
  }
  return (
    <main className="main">
      <div className="editor-header">
        <input
          className="title-input"
          placeholder="Untitled note"
          value={note.title}
          onChange={(e) => onChangeTitle(e.target.value)}
        />
        <div className="editor-actions">
          <button className="btn btn-outline danger" onClick={onDelete} aria-label="Delete note">
            Delete
          </button>
        </div>
      </div>
      <textarea
        className="content-input"
        placeholder="Start typing your note..."
        value={note.content}
        onChange={(e) => onChangeContent(e.target.value)}
      />
    </main>
  );
}

export default App;
