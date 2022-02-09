const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

let position = {
  x: 320,
  y: 240,
};
let maxSize = {
  x: 0,
  y: 0,
};
function left() {
  position.x -= 20;
}
function right() {
  position.x += 20;
}
function up() {
  position.y -= 20;
}
function down() {
  position.y += 20;
}
movies = [left, right, up, down];

function randomInt(l) {
  let rand = Math.random() * (l + 1);
  return Math.floor(rand);
}

Socketio.on("connection", (socket) => {
  socket.on("maxSize", (data) => {
    maxSize.x = data.maxX;
    maxSize.y = data.maxY;
  });
  setInterval(() => {
    const idx = randomInt(movies.length - 1);
    if (idx === 0 && position.x !== 0) movies[idx]();
    if (idx === 1 && position.x !== maxSize.x - 20) movies[idx]();
    if (idx === 2 && position.y !== 0) movies[idx]();
    if (idx === 3 && position.y !== maxSize.y - 20) movies[idx]();
    Socketio.emit("position", position);
  }, 500);
  socket.emit("position", position);
});

Http.listen(3000, () => {
  console.log("Server has been started...");
});
