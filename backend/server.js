const app = require("./app");

const port = process.env.PORT || 3001;
const host = "0.0.0.0";

app.listen(port, host, () => {
    console.log(`API disponible en http://${host}:${port}`);
});
