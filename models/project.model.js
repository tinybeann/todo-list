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
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema, 'projects');

export default Project;
