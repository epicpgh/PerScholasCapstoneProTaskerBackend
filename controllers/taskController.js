



import Task from "../models/Task.js";
import Project from "../models/Project.js";

export const getTasks = async (req, res) => {
  try {
    // First verify the project belongs to the authenticated user
    const project = await Project.findOne({
      _id: req.params.projectId,
      user: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied' });
    }

    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error);
    res.status(500).json({ message: error.message });
  }
};


export const createTask = async (req, res) => {
  try {
    console.log('🚀 Creating task for project:', req.params.projectId);
    console.log('📄 Request body:', req.body);
    console.log('👤 User ID:', req.user._id);

    // Verify project exists and belongs to user
    const project = await Project.findOne({ 
      _id: req.params.projectId,
      user: req.user._id
    });
    
    if (!project) {
      console.error('❌ Project not found or access denied');
      return res.status(404).json({ message: "Project not found or you do not have access to it" });
    }

    console.log('✅ Project found:', project.name);

    const { title, description, status, dueDate, assignedTo } = req.body;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || '',
      status: status || 'To Do',
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
      project: req.params.projectId
    });

    console.log('✅ Task created successfully:', task._id);
    res.status(201).json(task);
  } catch (error) {
    console.error('❌ Error creating task:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('project', 'name');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    
    const project = await Project.findOne({
      _id: task.project._id,
      user: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo } = req.body;

    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify the task belongs to a project owned by the user
    const project = await Project.findOne({
      _id: task.project._id,
      user: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.title = title;
    task.description = description;
    task.status = status;
    task.dueDate = dueDate;
    task.assignedTo = assignedTo;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Verify the task belongs to a project owned by the user
    const project = await Project.findOne({
      _id: task.project._id,
      user: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};