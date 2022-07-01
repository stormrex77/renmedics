export const LOAD_NOTE = "LOAD_NOTE";
export const UPDATE_NOTE = "UPDATE_NOTE";
export const CREATE_NOTE = "CREATE_NOTE";

export function loadNote() {
 return dispatch => {
  fetch("http://localhost:3000/api/v1/notes")
   .then(response => response.json())
   .then(json => dispatch({ type: LOAD_NOTE, payload: json })
 )}
}

export function createNote(noteContent) {
 return dispatch => {
  fetch("http://localhost:3000/api/v1/notes", {
   method: "post",
   headers: { "Content-Type": "application/json", "Accepts": "application/json" },
   body: JSON.stringify({ content: noteContent })
  })
   .then(response => response.json())
   .then(json => {dispatch({ type: CREATE_NOTE, newNote: json })
   })
 }
}

export function updateNote(note_id, note_content) {
    return dispatch => {
     fetch(`http://localhost:3000/api/v1/notes/${note_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accepts: "application/json" },
      body: JSON.stringify({ content: note_content})
     })
      .then(response => response.json())
      .then(json =>
       dispatch({ type: UPDATE_NOTE, updated_note: json })
      );
    };
   }