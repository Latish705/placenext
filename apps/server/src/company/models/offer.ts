import { Schema, model, Types, Document } from 'mongoose';
import { primarydb } from '../..';

export interface IOffer extends Document {
  package: number;
  company: string;
  jobId: Types.ObjectId;
  studentId: Types.ObjectId;
  status: 'offered' | 'accepted' | 'rejected';
  offerNumber: number;
}

const OfferSchema = new Schema<IOffer>({
  package: { type: Number, required: true },
  company: { type: String, required: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  status: {
    type: String,
    enum: ['offered', 'accepted', 'rejected'],
    default: 'offered'
  }
}, {
  timestamps: true
});

const Offer = primarydb.model('Offer', OfferSchema);
export default Offer;
