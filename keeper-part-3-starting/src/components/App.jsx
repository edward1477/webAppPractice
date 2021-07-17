import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { parseJsonText } from "typescript";

function App() {

  const [notes, setNotes] = useState([]);

  function addNote(note) {
    setNotes(preNotes => {
      return [...preNotes, note];
    });
  }

  function deleteNote(id) {
    setNotes(preNotes => {
      return preNotes.filter((note, index) => {
        return index !== id;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((note, index) => (
        <Note
          key={index}
          id={index}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
