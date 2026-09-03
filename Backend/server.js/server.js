const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Calculator backend is working!');
});
    
app.post("/calculate", (req, res) => {
    const { num1, num2, operator } = req.body;
    let result;
    
    if(operator === "+") result = num1 + num2;
    if(operator === "-") result = num1 - num2;
    if(operator === "*") result = num1 * num2;
    if(operator === "/") result = num1 / num2;
    
    res.json({ result });
});

app.listen(3000, () => {
    console.log("Calculator server is running on port 3000");
});