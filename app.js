const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const PORT = 12345;

let obj = {
    user : 'Mateo',
};

let obj2 = [
    {
        user: 'Mateo',
        missingWork : 2
    },
    {
        user: 'Mario',
        missingWork : 3,
    }
];

//Routes
app.get('/', (req, res) => {
    res.send(obj2);
});

app.post('/students', (req, res) => {
    let a = req.body.students;
    console.log(a);
    res.send(obj2);
});


app.listen(PORT, () => {
    console.log(`Started on port: ${PORT}`);
});