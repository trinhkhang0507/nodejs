const mongoose = require('mongoose');
const slugify = require('slugify');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    videoId: { type: String, required: true },
    level: { type: String },
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  },
);

// 👉 Tự động tạo slug từ name
CourseSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true, // bỏ ký tự đặc biệt
      locale: 'vi',
    });
  }
});

CourseSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

module.exports = mongoose.model('Course', CourseSchema);
