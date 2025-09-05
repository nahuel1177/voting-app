import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IVoteCount {
  party: Types.ObjectId;
  votes: number;
}

export interface IVotingTable extends Document {
  tableNumber: number;
  location: string;
  totalVotes: number;
  votes: IVoteCount[];
  createdAt: Date;
  updatedAt: Date;
}

const VoteCountSchema: Schema = new Schema({
  party: { type: Schema.Types.ObjectId, ref: 'Party', required: true },
  votes: { type: Number, required: true, min: 0 }
});

const VotingTableSchema: Schema = new Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    location: { type: String, required: true },
    totalVotes: { type: Number, default: 0 },
    votes: [VoteCountSchema]
  },
  {
    timestamps: true,
  }
);

// Update totalVotes before saving
VotingTableSchema.pre<IVotingTable>('save', function(next) {
  this.totalVotes = this.votes.reduce((sum, vote) => sum + vote.votes, 0);
  next();
});

export default mongoose.model<IVotingTable>('VotingTable', VotingTableSchema);
