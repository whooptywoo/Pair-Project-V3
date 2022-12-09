const { Course, User, Instructor, Student, Enrollment } = require('../models')
const bcrypt = require('bcryptjs')


class Controller {
    static home(req, res) {
        Course.findAll()
            .then(courses => {
                res.render('home', { courses })
            })
            .catch(err => res.send(err))
    }

    static courseDetail(req, res) {
        // console.log(req.params.courseId);
        const data = {}
        if (req.params.userId !== null) {
            Student.findByPk(req.params.userId, { include: Course })
                // .then(student => {
                //     data.student = student;
                //     return Course.findByPk(+req.params.courseId, { include: Instructor })
                // })
                .then(student => {
                    let status = "";
                    student.Courses.forEach(el => {
                        if (el.id === +req.params.courseId && el.Enrollment.isDone === true) {
                            console.log(el.id === +req.params.courseId && el.Enrollment.isDone === true);
                            status = Student.checkStatus(1);
                        }
                    })
                    data.student = student;
                    data.status = status
                    return Course.findByPk(+req.params.courseId, { include: Instructor })
                })
                .then(course => {
                    data.course = course
                    // res.send(data.status)
                    res.render('courseDetail', data)
                })
                .catch(err => {
                    console.log(err)
                    res.send(err)
                })
        } else {
            Course.findByPk(+req.params.courseId, { include: Instructor })
                .then(course => {
                    data.course = course
                    res.send(data)
                })
                .catch(err => console.log(err))
        }
    }

    static enrollCourse(req, res) {
        Enrollment.create({
            isDone: false,
            CourseId: +req.params.courseId,
            StudentId: +req.params.userId
        })
            .then(() => res.redirect(`/${req.params.userId}/${req.params.courseId}/courseDetail`))
            .catch((err) => res.send(err))
    }

    static registerForm(req, res) {
        const errors = req.query.errors
        res.render('register', { errors })
    }

    static register(req, res) {
        const errors = req.query.errors
        const data = req.body
        User.create({
            email: data.email,
            password: data.password,
            role: data.role,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .then(user => {
                const id = +user.dataValues.id
                console.log(id)
                // if (data.role === 'Instructor') {
                    // console.log('masuk')
                    // console.log(id)
                    // Instructor.create({
                    //     name: data.name,
                    //     createdAt: new Date(),
                    //     updatedAt: new Date(),
                    //     UserId: id
                    // })
                    //     .then(instructor => res.render('login'))
                    //     .catch(err => console.log(err))
                // } else {
                    Student.create({
                        name: data.name,
                        dob: data.dob,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        UserId: id
                    })
                        .then(student => res.redirect('/login'))
                        .catch(err => console.log(err))
                // }
            })
            .catch(err => {
                if (err.name === "SequelizeValidationError") {
                    const errors = err.errors.map(el => el.message)
                    res.redirect(`/register?errors=${errors}`)
                } else {
                    res.send(err)
                }
            })
    }

    static loginForm(req, res) {
        const error = req.query.error
        res.render('login', { error })
    }

    static login(req, res) {
        const { email, password } = req.body

        User.findOne({ where: { email } })
            .then(user => {
                if (user) {
                    const isValidPassword = bcrypt.compareSync(password, user.password)
                    if (isValidPassword) {
                        req.session.userId = user.id
                        return res.redirect(`/${user.id}`)
                    } else {
                        const error = 'Email/Password is invalid!'
                        return res.redirect(`/login?error=${error}`)
                    }
                } else {
                    const error = 'Email/Password is invalid!'
                    return res.redirect(`/login?error=${error}`)
                }
            })
            .catch(err => console.log(err))
    }


    static homeUser(req, res) {
        const data = {};
        let role = "";
        Course.findAll()
            .then(courses => {
                data.courses = courses;
                // res.send(data)
                return User.findByPk(+req.params.userId, { include: [Student, Instructor] })
            })
            .then(user => {
                // res.send(user)
                if (user.Student) {
                    role = "student"
                    return Student.findOne({ where: { UserId: +req.params.userId }, include: Course })
                } else if (user.Instructor) {
                    console.log('masuk instructor')
                    role = "instructor"
                    return Instructor.findOne({ where: { UserId: +req.params.userId }, include: Course })
                }
            })
            .then(user => {
                if (role === "student") {
                    // user.Courses.forEach(el => {
                    //     if (el.Enrollment.isDone === true) {
                    //         status = Student.checkStatus(1);
                    //     } else {
                    //         status = Student.checkStatus(0);
                    //     }
                    // })
                    data.user = user
                    const idTakenCourses = data.user.Courses.map(el => {
                        return el.id
                    })
                    data.idTakenCourses = idTakenCourses;
                    // res.send(data)
                    res.render('home-student', data)
                } else {
                    data.user = user
                    const options = { include: Course }
                    if (req.query.search) {
                        options.where = { name: { [Op.iLike]: `%${req.query.search}%` } }
                    }
                    return Student.findAll(options)
                }
            })
            .then(students => {
                if (role !== "student") {
                    data.students = students;
                    const filteredStudents = []
                    // console.log(data.user);
                    const instructorCourse = data.user.Course.id
                    data.students.forEach(el1 => {
                        el1.Courses.forEach(el2 => {
                            if (el2.id === instructorCourse) {
                                filteredStudents.push(el1)
                            }
                        })
                    })
                    data.filteredStudents = filteredStudents
                    // console.log(filteredStudents)
                    // res.send(data)
                    res.render('home-instructor', data)
                }
            })
            .catch(err => {
                console.log(err)
                res.send(err)
            })
    }


    static markDone(req, res) {
        console.log(req.params.studentId)
        console.log(req.params.courseId)
        Enrollment.update({ isDone: true }, {
            where: {
                StudentId: +req.params.studentId,
                CourseId: +req.params.courseId
            }
        })
            .then(() => res.redirect(`/${req.params.userId}`))
            .catch((err) => res.send(err))
    }

    static getLogOut(req, res) {
        req.session.destroy((err) => {
            if (err) console.log(err)
            else res.redirect('/')
        })
    }
}
module.exports = Controller