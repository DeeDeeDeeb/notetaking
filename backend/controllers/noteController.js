import Note from "../models/Note.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"


export async function createUser(req,res){
    console.log("received",req.body)
    try{
        const{username, email, password} = req.body
        const existing = await User.findOne({email})
        if (existing) return res.status(400).json({message:"User exists"})
        const newUser= new User({username,email,password})
        const savedUser = await newUser.save()

        const token = jwt.sign({ userId: savedUser._id, username:savedUser.username}, process.env.JWT_SECRET, {expiresIn: "1h",});
        res.status(201).json({ token, user :savedUser, username: savedUser.username})
    } catch(error){
            console.error("Error in createUser",error)
            res.status(500).json({message:"Internal server"})
    }
}

export async function loginUser(req,res) {
    const{email,password} = req.body
    try{
        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({message: "user not found"})
        }
        if(password != user.password){
            return res.status(400).json({message:"incorrect password"})
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, username:user.username, message: 'Login successful'});
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: 'Server error' });
            }
    }

export async function getAllUsers(req,res) {
    try{
        const users = await User.find()
        res.json(users)
    } catch(error){
        console.error("Error in getAllUsers", error)
        res.status(500).json({message: "Internal server error"})
    }
}
    



export async function getAllNotes(req,res){
    try{
        const notes = await Note.find({ userId: req.user.userId }).sort({createdAt: -1})
        res.status(200).json(notes)
    } catch(error){
        console.error("Error in getAllNotes", error)
        res.status(500).json({message: "Internal server error"})
    }
}

export async function createNote(req,res){
    try{
        console.log("Request body:", req.body);             
        console.log("Authenticated user:", req.user);

        const {title,content,dueDate} = req.body
        const note = new Note({title,content,dueDate,userId: req.user.userId })
        const savedNote = await note.save();
        res.status(201).json(savedNote)        
    } catch(error){
        console.error("Error in createNote",error)
        res.status(500).json({message:"Internal server"})
    }
}

export async function getNoteById(req,res){
    try{
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message:"Note not found"});
        if (note.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        res.json(note)
    }catch(error){
        console.error("Error in getNotrById controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteNote(req,res){
    try{
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({message: "Note not found"});
        if (note.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        res.status(200).json({deletedNote, message:"Note deleted successfully"})
} catch (error) {
    console.error("Error in deletedNote controller", error);
    res.status(500).json({message:"Internal server error"});
 }
}


export async function updateNote(req,res){
    try{
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        if (note.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const {title,content,dueDate}=req.body
        note.title = title;
        note.content = content;
        note.dueDate = dueDate;

        const updatedNote = await note.save();
         res.status(200).json(updatedNote);
    } catch(error){
         console.error("Error in updateNote controller", error);
         res.status(500).json({message:"Internal server error"});
    }
}


