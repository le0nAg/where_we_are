// File: src/models/Operator.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IOperator extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

const operatorSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, "Email address is required"],
    unique: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const Operator = mongoose.model<IOperator>('Operator', operatorSchema);
