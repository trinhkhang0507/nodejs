const Course = require('../models/Course');

class CourseController {
  async show(req, res, next) {
    try {
      const course = await Course.findOne({ slug: req.params.slug }).lean();
      res.render('courses/show', { course });
    } catch (error) {}
  }

  async create(req, res, next) {
    try {
      res.render('courses/create');
    } catch (error) {}
  }

  async store(req, res, next) {
    try {
      req.body.image = `https://img.youtube.com/vi/${req.body.videoId}/sddefault.jpg`;
      const course = new Course(req.body);
      await course.save();
      res.redirect('/me/stored/courses');
    } catch (error) {}
  }
  async edit(req, res, next) {
    try {
      const course = await Course.findById(req.params.id).lean();

      if (!course) {
        return res.status(404).send('Course not found');
      }

      res.render('courses/edit', { course });
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      await Course.findByIdAndUpdate(req.params.id, req.body);
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }
  async destroy(req, res, next) {
    try {
      await Course.delete({ _id: req.params.id });
      res.redirect('/me/stored/courses');
    } catch (error) {
      next(error);
    }
  }

  async forceDestroy(req, res, next) {
    try {
      await Course.deleteOne({ _id: req.params.id });
      res.redirect('/me/trash/courses');
    } catch (error) {
      next(error);
    }
  }

  async restore(req, res, next) {
    try {
      await Course.restore({ _id: req.params.id });
      res.redirect('/me/trash/courses');
    } catch (error) {
      next(error);
    }
  }

  async handleFormActions(req, res, next) {
    switch (req.body.action) {
      case 'delete':
        Course.delete({ _id: { $in: req.body.courseIds } })
          .then(() => res.redirect('/me/stored/courses'))
          .catch(next);
        break;
      case  'restore':
        Course.restore({ _id: { $in: req.body.courseIds } })
          .then(() => res.redirect('/me/trash/courses'))
          .catch(next);
        break;
      default:
        res.json({ message: 'Hành động không hợp lệ!' });
    }
  }
  
}
module.exports = new CourseController();
