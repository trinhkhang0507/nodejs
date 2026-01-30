const Course = require('../models/Course');

class SiteController {
  async index(req, res, next) {
    try {
      const courses = await Course.find({}).lean();
      res.render('home', { courses });
    } catch (error) {
      next(error);
    }
  }

  search(req, res) {
    res.render('search');
  }
}

module.exports = new SiteController();
