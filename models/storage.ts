import mongoose, { Document } from 'mongoose';

const storageSchema = new mongoose.Schema(
  {
    accessKey: {
      type: String,
      required: true,
    },
    secretKey: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.Storage || mongoose.model<StorageType>("Storage", storageSchema);

export interface StorageType extends Document {
  type: string;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
}
