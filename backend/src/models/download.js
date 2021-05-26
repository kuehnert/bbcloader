const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  programme: { type: String, unique: true, required: true, trim: true, },
  series: { type: Number, },
  episodeNumber: { type: Number, },
  episodeTitle: { type: String, trim: true, },
  filename: { type: String, trim: true, },
  year: { type: String, trim: true, },
  attempts: { type: Number, required: true, default: 0 },
  tagged: { type: Boolean, default: false },
  isFilm: { type: Boolean, default: false },
  downloaded: { type: Boolean, default: false },
  downloadedAt: { type: Date },
});

const Download = mongoose.model("download", downloadSchema);

module.exports = Download;
