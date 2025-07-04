import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const API = 'http://localhost:5000'

function App() {
  const [title, setTitle] = useState('')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([])
  const[editingId,setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const[dueDate, setDueDate] = useState('')
  const[editDueDate, setEditDueDate ] = useState('')

  useEffect(() => { 
    const fetchNotes = async () => {
      const token = localStorage.getItem('token');
      if (!token) return; 
      try {
        const res = await fetch(`${API}/api/notes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(data);
        } else {
          console.error("Fetch failed:", data.message);
        }
      } catch (err) {
        console.error("Error", err);
      }
  };
  fetchNotes();
  },[])

  const handleCreate = async() => {
    if(!title || !note) return;
    const newNote = {title, content: note, dueDate}
    try{
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/notes`,{method: 'POST', headers:{'Content-Type':'application/json','Authorization': `Bearer ${token}`},body:JSON.stringify(newNote)})
      const savedNote = await res.json()
      setNotes([savedNote, ...notes]);
      setTitle('');
      setNote('');
      setDueDate('')
    } catch(error){
    console.error('Error creating note',error)
  }
}

  const handleDelete = async(id) => {
    try{
      const token = localStorage.getItem('token');
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
    const formattedDate = note.dueDate ? new Date(note.dueDate).toISOString().split('T')[0] : '';
    setEditDueDate(formattedDate);
  }

  const handleEditSave = async () =>{
    try{
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/notes/${editingId}`,{method:'PUT', headers:{'Content-Type':'application/json','Authorization': `Bearer ${token}`}, body:JSON.stringify({title: editTitle, content:editContent,dueDate: editDueDate })})
      const updatedNote = await res.json()
      setNotes(notes.map((note) => 
        note._id === editingId ? updatedNote : note
      ))
      setEditingId(null)
      setEditTitle('')
      setEditContent('')
      setEditDueDate('')
    } catch (error){
      console.error('Error',error)
    }
  }

  const daysleft = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const left = (due - today)/(1000*60*60*24)
    if (left <= 0) return 100;
    const maxsize = 10
    const percentage = (1 - Math.min(left, maxsize) / maxsize) * 100;
    return Math.round(percentage)
  }


  const navigate = useNavigate()
  const username = localStorage.getItem('username')
  const handleSignOut = async() => {
    localStorage.removeItem("token")
    navigate("/login")
  }


  return (
    <div className="min-h-screen bg-gray-500 flex items-center justify-center p-6 ">      
      <div className=" w-full max-w-3xl space-y-6">
          <div className='bg-gray-200 p-4 rounded-b-md shadow'>
            <div className='flex space-x-10'>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className='w-2/3 mb-2 p-2 rounded border border-gray-300' placeholder='Task'/><br/>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className='mb-2' required placeholder='Duedate'/>
              <button onClick={handleCreate} className= "font-bold py-2 px-4 rounded">Create</button>
            </div>
              <textarea value={note}  onChange={(e) => setNote(e.target.value)} className="w-full p-3 h-24 rounded border border-gray-300" placeholder="Description"/>
            </div>
            <div>
              <div className="text-lg font-semibold absolute top-0 left-0 m-3 underline text-gray-800">
                {username || "Guest"}
              </div>

              <button onClick={handleSignOut} className='text-white bg-gray-800 hover:bg-gray-900 rounded text-sm p-3 m-3 absolute bottom-0 right-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700'>Sign out</button>
            </div>
            
            


        <div className="bg-white p-4 rounded-2xl">
          {notes.length === 0 ? (
            <p className="text-gray-400 text-center">No notes yet</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note._id} className="bg-gray-200 p-3 rounded flex justify-between items-center group">   
                  <div>
                    {editingId === note._id ? (
                      <div>
                        <input type="text"value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full mb-1 p-1 rounded border"/>
                        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-1 h-20 rounded border"/>
                        <button onClick={handleEditSave} className="text-green-600 font-bold m-2 "> Save</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 font-bold m-2"> Cancel </button>
                        <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className='m-2' required/><br/>
                      </div>) : (
                        <div>
                          <h2 className="font-semibold text-gray-800">{note.title}</h2>
                          <p className="text-gray-700 opacity-0 group-hover:opacity-100 transition duration-200">{note.content}</p>
                          <progress value ={daysleft(note.dueDate)} max={100} className='w-full h-2'/>
                          <p className='text-gray-500'> Due: { note.dueDate ? new Date(note.dueDate).toLocaleDateString('en-GB') : "No due date"}</p>
                        </div>)}
                    </div>
                  <div className='flex space-x-5'>
                    <button onClick={() => handleEdit(note)} className="text-blue-600 font-bold text-lg hover:text-blue-800">edit</button>
                    <button onClick={() => handleDelete(note._id)} className="text-red-600 font-bold text-lg hover:text-red-800">delete</button>
                  </div>
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

