const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 12345;

app.use(bodyParser.json());

class Student{
    constructor(name, lastname, studentCode, identificationCard, missingWork){
        this.name = name;
        this.lastname = lastname;
        this.studentCode = studentCode;
        this.identificationCard = identificationCard;
        this.missingWork = missingWork;
    }
}

let students = [
    new Student('Mateo','Valdes Otero','1','1',1),
    new Student('Esteban','Ariza Acosta','2','2',1),
    new Student('Samuel','Satizabal Tascon','3','3',1),
    new Student('Johan Sebastian','Giraldo Rubio','4','4',1),
    new Student('Juan David','Ossa Ossa','5','5',1),
    new Student('Ernesto','N/A','6','6',1),
    new Student('Christian','Flor Astudillo','7','7',1),
];

//Methods
function loadCSV(csv){
    console.log("LOADED :)");
}

//Routes
app.get('/students', (req, res) => {
    res.send(students);
});

app.post('/students/identificationcard', (req, res) => {
    let value = req.body.identificationCard;

    let info = undefined;
    students.forEach(i =>{
        if(i.identificationCard === value)
            info = i;
    });
    
    res.send(info);
});

app.post('/students/studentCode', (req, res) => {
    let value = req.body.studentCode;

    let info = undefined;
    students.forEach(i =>{
        if(i.studentCode === value)
            info = i;
    });
    
    res.send(info);
});

//Port
app.listen(PORT, () => {
    loadCSV("students.csv");
    console.log(`Started on port: ${PORT}`);
});