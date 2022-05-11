const express = require('express');
const csv = require('jquery-csv');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 12345;

app.use(bodyParser.json());

//Attributes
var students = [];

//Methods
const logicalComparator = {
    '<': function (x, y) { return x < y },
    '<=': function (x, y) { return x <= y },
    '=': function (x, y) { return x == y },
    '>=': function (x, y) { return x >= y },
    '>': function (x, y) { return x > y },
    '<>': function (x, y) { return x != y },
};

function loadCSV(path){
    let rawCsv = "";

    try {
        rawCsv = fs.readFileSync(path, 'utf8');
    } catch (err) {
        console.error(err);
    }

    students = csv.toObjects(rawCsv);

    console.log("Data loaded from: \'"+path+"\'");
}

function findStudentsStudentCode(studentCodes){
    let info = [];
    students.forEach(i =>{
        studentCodes.forEach(j =>{
            if(i.studentCode === j){
                info.push(i);
            }
        });
    });
    
    return info;
}

//Routes
app.get('/students', (req, res) => {
    console.log("Request at /students");
    res.send(students);
});

app.post('/students/query/:data', (req, res) => {
    let studentCodes = req.body.students;
    let column = req.params.data;
    let operator = req.body.operator;
    let value = parseFloat(req.body.value);

    let studentsQuery = students;
    if(typeof studentCodes !== 'undefined')
        studentsQuery = findStudentsStudentCode(studentCodes);

    let info = [];
    studentsQuery.forEach(i =>{
        actualValue = i[column]
        if(logicalComparator[operator](actualValue, value))
            info.push(i['studentCode']);
    });
    
    console.log("Request at /students/query");
    res.send(info);
});


app.get('/students/identificationcard/:id', (req, res) => {
    let value = req.params.id;

    let info = undefined;
    students.forEach(i =>{
        if(i.identificationCard === value)
            info = i;
    });
    
    console.log("Request at /students/identificationcard");
    res.send(info);
});

app.get('/students/studentCode/:id', (req, res) => {
    let value = req.params.id;

    let info = undefined;
    students.forEach(i =>{
        if(i.studentCode === value)
            info = i;
    });
    
    console.log("Request at /students/studentCode");
    res.send(info);
});

//Port
app.listen(PORT, () => {
    loadCSV("students.csv");
    console.log(`Started on port: ${PORT}`);
});