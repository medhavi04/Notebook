import React, { useContext, useEffect, useRef, useState } from "react";
import NoteItem from "./NoteItem";
import noteContext from "../context/notes/noteContext";
import AddNote from "./AddNote";
import { useNavigate, useNavigation } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate=useNavigate();
  const { notes, getNotes, editNote} = context;
  const [note, setNote] = useState({id:"", etitle:"",edescription:"",etag:"default"});
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);

  // const myModal = new bootstrap.Modal('#myModal', {
  //   keyboard: false
  // })

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id:currentNote._id,etitle:currentNote.title, edescription:currentNote.description, etag:currentNote.tag})
  };
  const ref = useRef(null);
  const refClose = useRef(null);
  
  const handleClick=(e)=>{
    // console.log('Updating the note...',note);
    editNote(note.id,note.etitle,note.edescription,note.etag)
    refClose.current.click();
    props.showAlert("Updated Successfully","success");
}

const onChange=(e)=>{
    //Spread operator ...
    setNote({...note,[e.target.name]: e.target.value})
}

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      <button
        type="button"
        className="btn btn-primary d-none"
        ref={ref}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="my-3">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="etitle"
                    value={note.etitle}
                    aria-describedby="emailHelp"
                    onChange={onChange}
                    minLength={1}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note.edescription}
                    onChange={onChange}
                    minLength={5}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">
                    Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                  />
                </div>
                
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" disabled={note.etitle.length<1||note.edescription.length<5} onClick={handleClick}>
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your notes</h2>
        <div className="container mx-1">
          {notes.length===0&&"Nothing to display!"}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} showAlert={props.showAlert} updateNote={updateNote} note={note} />
          );
        })}
      </div>
    </>
  );
};

export default Notes;
