import mongoose, { Document, Schema } from 'mongoose';

export interface IParty extends Document {
  name: string;
  color: string;
  voteThreshold: number;
  createdAt: Date;
  updatedAt: Date;
}

const PartySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
    voteThreshold: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IParty>('Party', PartySchema);
