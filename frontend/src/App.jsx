import { useEffect, useState } from 'react';


const API = 'http://localhost:5000'

function App() {
  const [title, setTitle]=useState('')
  const [note, setNote]=useState('')
  const [notes, setNotes]=useState([])
  const[editingId,setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    fetch(`${API}/api/notes`).then((res) => res.json()).then((data) => setNotes(data))
    .catch((err) => console.error("Error",err))
  },[])

  const handleCreate = async() => {
    if(!title || !note) return;
    const newNote = {title, content: note}
    try{
      const res = await fetch(`${API}/api/notes`,{method: 'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify(newNote)})
      const savedNote = await res.json()
      setNotes([savedNote, ...notes]);
      setTitle('');
      setNote('');
    } catch(error){
    console.error('Error creating note',error)
  }
}

  const handleDelete = async(id) => {
    try{
      await fetch(`${API}/api/notes/${id}`,{method:'DELETE'})
      setNotes(notes.filter((note) => note._id !== id))
    } catch (error) {
      console.error('Error deleting note', error)
    }
  };
  const handleEdit = (note) => {
    setEditingId(note._id)
    setEditTitle(note.title)
    setEditContent(note.content)
  }

  const handleEditSave = async () =>{
    try{
      const res = await fetch(`${API}/api/notes/${editingId}`,{method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title: editTitle, content:editContent})})
      const updatedNote = await res.json()
      setNotes(notes.map((note) => 
        note._id === editingId ? updatedNote : note
      ))
      setEditingId(null)
      setEditTitle('')
      setEditContent('')
    } catch (error){
      console.error('Error',error)
    }
  }


  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center p-6 ">      
        <div className=" w-full max-w-3xl space-y-6">
          <div className='bg-gray-200 p-4 rounded-b-md shadow '>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='w-full mb-2 p-2 rounded border border-gray-300' placeholder='Title'/><br/>
          <textarea value={note}  onChange={(e) => setNote(e.target.value)} className="w-full p-3 h-24 rounded border border-gray-300" placeholder="Create new note"/>
          <button onClick={handleCreate} className= "justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create</button>
        </div>

        <div className="bg-white p-4 rounded-2xl">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center">No notes yet</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note._id} className="bg-gray-200 p-3 rounded flex justify-between items-center">
                  <div>
                    {editingId === note._id ? (
                      <div>
                        <input type="text"value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full mb-1 p-1 rounded border"/>
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-1 h-20 rounded border"/>
                        <button onClick={handleEditSave} className="text-green-600 font-bold mr-2"> Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 font-bold"> Cancel </button>
                      </div>) : (
                        <div>
                          <h2 className="font-semibold text-gray-800">{note.title}</h2>
                          <p className="text-gray-700">{note.content}</p>
                        </div>)}
                    </div>
                  <button onClick={() => handleEdit(note)} className="text-blue-600 font-bold text-lg hover:text-blue-800 mr-4">edit</button>
                  <button onClick={() => handleDelete(note._id)} className="text-red-600 font-bold text-lg hover:text-red-800">delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

