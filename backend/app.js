const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.set('view engine', 'ejs');

const PORT = process.env.PORT || 5050;

app.get("/:client_id/:plan_id", (req, res) => {
    res.render("subscribe", {
        client_id: req.params.client_id,
        plan_id: req.params.plan_id
    })
})

app.use("/", (req, res) => {
    res.render("error");
})

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});