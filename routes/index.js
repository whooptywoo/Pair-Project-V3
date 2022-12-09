const { application } = require('express');
const express = require('express');
const router = express.Router();
const Controller = require('../controllers/');



router.get('/', Controller.home);

router.get('/register', Controller.registerForm)
router.post('/register', Controller.register)
router.get('/login', Controller.loginForm)
router.post('/login', Controller.login)
router.get('/logout', Controller.getLogOut)
router.get('/courseId/courseDetail', Controller.courseDetail)


router.use((req, res, next) => {
  console.log(req.session)

  if(!req.session.userId){
    const error = `Please login first!`
    res.redirect(`/login?error=${error}`)
  } else {
    next()
  }
})

// const isInstructor = function(req, res, next) {
//   console.log(req.session)

//   if(!req.session.role){
//     const error = `Please login first!`
//     res.redirect(`/login?error=${error}`)
//   } else if (req.session.role === 'Instructor') {
//     next()
//   }
// }

// const isStudent = function(req, res, next) {
//   console.log(req.session)

//   if(!req.session.role){
//     const error = `Please login first!`
//     res.redirect(`/login?error=${error}`)
//   } else if (req.session.role === 'Student') {
//     next()
//   }
// }
router.get('/:userId', Controller.homeUser)
router.get('/:userId/:courseId/:studentId/markDone', Controller.markDone)
router.get('/:userId/:courseId/courseDetail', Controller.courseDetail)
router.get('/:userId/:courseId/enroll', Controller.enrollCourse)



module.exports = router;