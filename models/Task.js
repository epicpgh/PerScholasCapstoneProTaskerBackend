




import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },


    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['To do', 'In Progress', 'Done', 'Overdue'],
        default: 'To do'
    
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dueDate: {
        type: Date
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }

});

const Task = mongoose.model('Task', taskSchema);

export default Task
