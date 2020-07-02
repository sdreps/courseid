// const Joi = require('@hapi/joi');
const express = require('express');
const app = express();
const courses = require('./courses')

app.use(express.json());



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.post('/api/courses', (req, res) => {
    const {isValid, error } = validateCourse(req.body);
    if (error) {
        res.status(400).send(error);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id', (req, res) => {
    let {id} = req.params;
    id = parseInt(id);
    const { error, course } = validateCourse({id});
     
    if (error) {
        res.status(400).send(error);
        return;
    }
    
    res.send(course);
});

function validateCourse(body) {
    const {name, id} = body;
    if (!name && !id) {
        return {isValid: false, error: 'Name or ID must be provided.'};
    }
    if (name && name.length < 3){
        return {isValid: false, error: 'Name must be greater than 3 characters.'};
    }
    
    let course = id ? courses.find(c => c.id === parseInt(id)): courses.find(c => c.name === name);
    if (course){
        return {isValid: true, course};
    }
    else {
        return {isValid: false, error: 'The course with the given name or ID was not found'}
    }

}

app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) res.status(404).send('The course with the given ID was not found')
    res.send(course);
});

const port = process.env.PORT || 3000
app.listen(3000, () => 
    console.log(`Listening on port ${port}...`));