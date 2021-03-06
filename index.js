const express   = require('express');
const morgan    = require('morgan');
const cors      = require('cors');
const app = express();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`))