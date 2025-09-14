import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: String,
    createdBy: String,
    listUser: Array,
    listTask: Array, 
    deleted: {
      type: Boolean,
      default: false,
    },
    share: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    
    userRoles: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
        role: {
          type: String,
          enum: ['view', 'edit'],  
          default: 'view', 
        },
      },
    ],
  },
  {
    timestamps: true,  // Tự động thêm createdAt và updatedAt
  }
);

const Project = mongoose.model('Project', projectSchema, 'projects');

export default Project;
