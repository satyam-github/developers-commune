const express = require('express');

const app = express();

app.get('/', (req, res) => res.send("Scoial Network"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER RUNNING AT PORT ${PORT}`));