import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  votesPerCouncilor: number;
  totalCouncilors: number;
  updatedAt: Date;
}

const SettingsSchema: Schema = new Schema(
  {
    votesPerCouncilor: { type: Number, required: true, default: 1000 },
    totalCouncilors: { type: Number, required: true, default: 8, min: 1 },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// Ensure there's only one settings document
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model<ISettings>('Settings', SettingsSchema);
