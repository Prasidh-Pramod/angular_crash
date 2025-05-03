const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const app = express();
app.use(cors());
app.use(express.json());

// Mock users database
const users = [
    {
        id: 1,
        username: 'testuser',
        password: '$2a$10$Zz0n0Xg6CqX0qzVnPRSk0u9Pz1xHqqi.3wgmwQ6npTAnl5tTL2iHy' // "password123" hashed
    }
];

// Mock tasks database
const tasks = [
    { id: 1, text: 'Doctors Appointment', day: 'May 5th at 2:30pm', reminder: true },
    { id: 2, text: 'Meeting at School', day: 'May 6th at 1:30pm', reminder: true },
    { id: 3, text: 'Grocery Shopping', day: 'May 7th at 12:30pm', reminder: false }
];

const SECRET_KEY = 'your_secret_key'; // Should be stored safely

mongoose.connect('mongodb://localhost:27017/taskmanager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.error('MongoDB connection error ❌:', err));


// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Public: Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    console.log(username, password, users)
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    // const hasedValue = await bcrypt.hash(password,10);
    // console.log(hasedValue, 'hi')
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
});

// app.delete('/tasks/:id', (req,res) =>{
//     const taskId = parseInt(req.params.id);
//     const indexMatched = tasks.findIndex(task => task.id === taskId);
//     if(indexMatched == -1){
//         return res.status(404).json({ message: 'Task not found' });
//     }
//     else{
//         const deletedItem = tasks.splice(indexMatched,1)
//         return res.json(deletedItem[0]);
//     }
// })

app.delete('/tasks/:id', async (req, res) => {
    try {
      console.log(parseInt(req.params.id))
      const deletedTask = await Task.findOneAndDelete({ id: parseInt(req.params.id) });
      if (!deletedTask) return res.status(404).json({ message: 'Task not found' });
      res.json(deletedTask);
    } catch (err) {
      res.status(500).json({ message: 'Error deleting task', error: err });
    }
  });

// app.post('/tasks', (req, res) => {
//     const { text, day, reminder } = req.body;
//     const newTask = {
//         id: tasks.length + 1,
//         text,
//         day,
//         reminder
//     };

//     tasks.push(newTask);
//     console.log(tasks);

//     return res.status(201).json(newTask); 
// });

app.post('/tasks', async (req, res) => {
    try {
      const { text, day, reminder } = req.body;
      const task = new Task({id: 1,text, day, reminder });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ message: 'Error creating task', error: err });
    }
  });
  

// Protected: Get Tasks
// app.get('/tasks', verifyToken, (req, res) => {
//     res.json(tasks);
// });


app.get('/tasks', async (req, res) => {
    try {
      const tasks = await Task.find();
      res.json(tasks);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching tasks', error: err });
    }
  });


app.post('/api/register', (req,res) =>{
    const {username, password} = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
      
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
      
          // Replace plain password with hashed version
          users.push({username,password: hash})
      
          // Now you can save the user object to your DB
          res.status(201).send({users})
        });
      });
})

// app.put('/tasks/:id', (req,res) =>{
//     const taskId = parseInt(req.params.id);
//     const indexMatched = tasks.findIndex(task => task.id === taskId);
//     tasks[indexMatched].reminder = !tasks[indexMatched].reminder;
// })

app.put('/tasks/:id', async (req, res) => {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // return updated document
      );
      if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
      res.json(updatedTask);
    } catch (err) {
      res.status(500).json({ message: 'Error updating task', error: err });
    }
  });
  

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
