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
/**
 * Compare two numeric values by a given string that represents the comparation. The posible comparations are: less, less or equal, equal, greater or equal, greater, different.
 * @example
 * //return true
 * localComparator['<='](3,4)
 * //return false
 * logicalComparator['>'](3,4)
 */
const logicalComparator = {
    '<': function (x, y) { return x < y },
    '<=': function (x, y) { return x <= y },
    '=': function (x, y) { return x == y },
    '>=': function (x, y) { return x >= y },
    '>': function (x, y) { return x > y },
    '<>': function (x, y) { return x != y },
};

const evaluate = (student, param, operator, value) => {

    if (operator === '=') operator = '===';

    switch (param) {
        case "missingWork":
            str = `${student.missingWork} ${operator} ${value}`;
            console.log(str);
            return (eval(str));
        default:
            console.log("Error");
    }

    // str = `${param} ${operator} ${value}`;
    // console.log(str);
    // console.log(eval(str));
    // return (eval(str)); 
}

/**
 * Load the CSV file that have the students from Intu with their information.
 * @param {string} path - The relative path of the CSV
 * @example
 * //Load file 'students.csv' if the file is in the same folder as 'app.js'
 * loadCSV('students.csv')
 */
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

/**
 * Find all students by their student code.
 * @param {string[]} studentCodes - The students codes.
 * @example
 * //returns an array with the students with student codes '1' and '2'.
 * //The student information is: name, lastname, studentCode, identificationCard, missingWork, weightedAverage.
 * findStudentsStudentCode(['1','2'])
 * @returns {students[]} All the students found by their student code.
 */
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
/** Express router providing student related routes.
 * @module students
 * @requires express
 */

/**
 * [GET] Obtain all available students in the mock server.
 * @name /students
 * @function
 * @example
 * URL: .../students
 * OUTPUT: JSON[] - All the students.
 * @memberof module:students
 * @inner
 * @returns {JSON[]} All the students (as a JSON files) from the mock server.
 */
app.get('/students', (req, res) => {
    console.log("Request at /students");
    res.send(students);
});

/**
 * [POST] Obtain all students that satisfy the query specifications.
 * @name /students/query
 * @function
 * @example
 * URL: .../students/query/missingWork
 * INPUT:
 * {
 *  'students':['1','2','6'],
 *  'operator':'<=',
 *  'value':3
 * }
 * OUTPUT: string[] - From the students with student code '1','2' and '6', the studen codes of the ones that have less or equal than 3 missing works.
 * @memberof module:students
 * @inner
 * @param {string[]} students - The student codes of the students which the query will be applied. Dont add this parameter if you want to apply the query to all the students.
 * @param {string} data - The name of the attribute that will be checked in the query students.
 * @param {string} operator - The logical operator that will be used in the query. The possible values are: '<','<=','=','>=','>','<>'.
 * @param {float} value - The value used for the comparison.
 * @return {string[]} All the student codes of the students that satisfy the query conditions.
 */
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

/**
 * [GET] Obtain the student with the specified identification card.
 * @name /students/identificationcard/{id}
 * @function
 * @example
 * URL: .../students/identificationcard/2
 * OUTPUT: JSON - The student with identification card '2'.
 * @memberof module:students
 * @inner
 * @return {JSON} The student (as a JSON file) with the specified identification card.
 */
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

/**
 * [GET] Obtain the student with the specified student code.
 * @name /students/studentcode/{id}
 * @function
 * @example
 * URL: .../students/studentCode/3
 * OUTPUT: JSON - The student with student code '2'.
 * @memberof module:students
 * @inner
 * @return {JSON} The student (as a JSON file) with the specified student code.
 */
app.get('/students/studentcode/:id', (req, res) => {
    let value = req.params.id;

    let info = undefined;
    students.forEach(i =>{
        if(i.studentCode === value)
            info = i;
    });
    
    console.log("Request at /students/studentCode");
    res.send(info);
});

app.post('/students/filter', (req, res) => {
    let list = req.body.students;
    let param = req.body.param;
    let operator = req.body.operator;
    let value = req.body.value;
    let ret = [];

    students.forEach(s => {
        if (evaluate(s, param, operator, value)) ret.push(s);
    });

    console.log(ret);
    res.send(ret);
});

//Port
app.listen(PORT, () => {
    loadCSV("students.csv");
    console.log(`Started on port: ${PORT}`);
});