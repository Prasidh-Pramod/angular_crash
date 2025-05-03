const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Your custom ID
  text: { type: String, required: true },
  day: { type: String, required: true },
  reminder: { type: Boolean, default: false }
}, {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('Task', taskSchema);
