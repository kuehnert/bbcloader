const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

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
  // orderIndex: { type: Number, required: true },
  programme: { type: String, trim: true, },
  series: { type: Number, },
  tagged: { type: Boolean, default: false },
  year: { type: String, trim: true, },
});

downloadSchema.plugin(autoIncrement.plugin, { model: 'Download', field: 'orderIndex' });

downloadSchema.statics.findNextDownload = () => {
  return Download.findOne({ tagged: true, downloaded: false }).where('attempts').lt(6).sort('orderIndex');
};

const Download = mongoose.model("download", downloadSchema);

module.exports = Download;
