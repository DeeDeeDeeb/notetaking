import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        content:{
            type:String,
            required:true
        },
        dueDate:{
            type:Date,
            required:true
        },
    },
    {timestamps:true}
);

const Note = mongoose.model("Note", NoteSchema)

export default Note