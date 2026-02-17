import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new'
    },
    ipAddress: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Add indexes
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

// Prevent model recompilation in development
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;