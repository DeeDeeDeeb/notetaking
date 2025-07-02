import Note from "../models/Note.js"
import User from "../models/User.js"
import jwt from "jsonwebtoken"


export async function createUser(req,res){
    console.log("received",req.body)
    try{
        const{username, email, password} = req.body
        const newUser= new User({username,email,password})
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch(error){
        if (error.code === 11000){
            const duplicateField = Object.keys(error.keyValue)[0];
            res.status(400).json({ message: `${duplicateField} already exists. Please choose another.` });
        } else{
            console.error("Error in createUser",error)
            res.status(500).json({message:"Internal server"})
        }
        
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
        res.status(200).json({ token, message: 'Login successful' });
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
        res.json(note)
    }catch(error){
        console.error("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function deleteNote(req,res){
    try{
        const deletedNote = await Note.findByIdAndDelete(req.params.id)
        if (!deletedNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json({message:"Note deleted successfully"})
} catch (error) {
    console.error("Error in deletedNote controller", error);
    res.status(500).json({message:"Internal server error"});
 }
}


export async function updateNote(req,res){
    try{
        const {title,content,dueDate}=req.body
        const updatedNote= await Note.findByIdAndUpdate(req.params.id,{title,content,dueDate},{
            new:true,
        });

        if (!updatedNote) return res.status(404).json({messgae:"note not found"})
        res.status(200).json(updatedNote)
    } catch(error){
         console.error("Error in updateNote controller", error);
         res.status(500).json({message:"Internal server error"});
    }
}


