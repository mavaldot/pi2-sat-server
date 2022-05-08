const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 12345;

app.use(bodyParser.json());

class Student{
    constructor(name, lastname, studentCode, identificationCard, missingWork, weightedAverage){
        this.name = name;
        this.lastname = lastname;
        this.studentCode = studentCode;
        this.identificationCard = identificationCard;
        this.missingWork = missingWork;
        this.weightedAverage = weightedAverage;
    }
}

let students = [
    new Student('Mateo','Valdes Otero','1','1',1, 5),
    new Student('Esteban','Ariza Acosta','2','2',2, 4.5),
    new Student('Samuel','Satizabal Tascon','3','3',3, 4.2),
    new Student('Johan Sebastian','Giraldo Rubio','4','4',4, 4.3),
    new Student('Juan David','Ossa Ossa','5','5',5, 3.5),
    new Student('Ernesto','N/A','6','6',2, 3.0),
    new Student('Christian','Flor Astudillo','7','7',3, 4.8),
];

//Methods
const logicalComparator = {
    '<': function (x, y) { return x < y },
    '<=': function (x, y) { return x <= y },
    '=': function (x, y) { return x == y },
    '>=': function (x, y) { return x >= y },
    '>': function (x, y) { return x > y },
    '<>': function (x, y) { return x != y },
};

function loadCSV(csv){
    console.log("LOADED :)");
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
        if(logicalComparator[operator](i[column], value))
            info.push(i['studentCode']);
    });
    
    console.log("Request at /students/query");
    res.send(info);
});


app.post('/students/identificationcard', (req, res) => {
    let value = req.body.identificationCard;

    let info = undefined;
    students.forEach(i =>{
        if(i.identificationCard === value)
            info = i;
    });
    
    console.log("Request at /students/identificationcard");
    res.send(info);
});

app.post('/students/studentCode', (req, res) => {
    let value = req.body.studentCode;

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