const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  bbcID: { type: String, required: true, unique: true, trim: true },
  addedAt: { type: Date, required: true },
  attempts: { type: Number, required: true, default: 0 },
  downloaded: { type: Boolean, default: false },
  downloadedAt: { type: Date },
  episodeNumber: { type: Number, },
  episodeTitle: { type: String, trim: true, },
  filename: { type: String, trim: true, },
  isFilm: { type: Boolean, default: false },
  orderIndex: { type: Number, required: true, unique: true },
  programme: { type: String, trim: true, },
  series: { type: Number, },
  tagged: { type: Boolean, default: false },
  year: { type: String, trim: true, },
});

downloadSchema.statics.findNextDownload = () => {
  return Download.findOne({ tagged: true, downloaded: false }).where('attempts').lt(6).sort('orderIndex');
};

downloadSchema.statics.lastIndex = async () => {
  const last = await Download.findOne().sort('-orderIndex');

  return (last) ? last.orderIndex + 1 : 0;
};

const Download = mongoose.model("download", downloadSchema);

module.exports = Download;
