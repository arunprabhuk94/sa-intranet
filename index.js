const app = require("./server/app");

const port = process.env.PORT || 3400;

app.listen(port, () => {
  console.log("Server listening on port " + port);
});
