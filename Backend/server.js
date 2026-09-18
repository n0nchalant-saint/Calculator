const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const calculationSchema = new mongoose.Schema({
    num1: Number,
    num2: Number,
    operator: String,
    value: Number,
    result: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Calculation = mongoose.model("Calculation", calculationSchema);

app.use(cors());
app.use(express.json());

// FIXED FOR RENDER
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/calculator")
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

app.get("/", (req, res) => {
    res.send("Calculator backend is working!");
});

app.post("/calculate", async (req, res) => {
    let { num1, num2, operator, value } = req.body;
    num1 = Number(num1);
    num2 = Number(num2);
    value = Number(value);
    let result;
    try {
        switch (operator) {
            case "sin":
                result = Math.sin(value * Math.PI / 180);
                break;
            case "cos":
                result = Math.cos(value * Math.PI / 180);
                break;
            case "tan":
                result = Math.tan(value * Math.PI / 180);
                break;
            case "sqrt":
                if (value < 0) throw new Error("Cannot sqrt negative");
                result = Math.sqrt(value);
                break;
            case "π":
            case "pi":
                result = Math.PI;
                break;
            case "^":
            case "power":
                result = Math.pow(num1, num2);
                break;
            case "+":
                result = num1 + num2;
                break;
            case "-":
                result = num1 - num2;
                break;
            case "*":
                result = num1 * num2;
                break;
            case "/":
                if (num2 === 0) throw new Error("Division by zero");
                result = num1 / num2;
                break;
            default:
                return res.status(400).json({ error: "Unknown operator" });
        }
        if (!Number.isFinite(result)) {
            throw new Error("Invalid calculation");
        }
        const calculation = new Calculation({ num1, num2, operator, value, result });
        await calculation.save();
        console.log("Calculation saved to MongoDB");
        res.json({ result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// FIXED PORT FOR RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Calculator server running on port ${PORT}`);
});
