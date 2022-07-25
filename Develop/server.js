const express = require('express');
const path = require('path');
const fs = require('fs');


const PORT = 3001;

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  const data = fs.readFileSync('./db/db.json',
    { encoding: 'utf8', flag: 'r' });
  const notes = JSON.parse(data);
  for (let i = 0; i < notes.length; ++i) {
    const note = notes[i];
    note.id = i;
  }
  res.json(notes);
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      text,
      title
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note

        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

// DELETE request for a single note
app.delete('/api/notes/:note_id', (req, res) => {
  if (req.body && req.params.note_id) {
    console.info(`${req.method} request received to delete a single note`);
    const noteId = parseInt(req.params.note_id);
    const data = fs.readFileSync('./db/db.json',
      { encoding: 'utf8', flag: 'r' });
    const notes = JSON.parse(data);
    notes.splice(noteId, 1);

    // Write updated notes back to the file
    fs.writeFile(
      './db/db.json',
      JSON.stringify(notes, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info('Successfully updated notes!')
    );

    res.json(`Note "${noteId}" deleted`);
  }
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
