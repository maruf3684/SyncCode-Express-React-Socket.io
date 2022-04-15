const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
const morgan = require("morgan");
const ACTIONS = require("./Actions");

//middlewere
app.use(morgan("tiny"));
app.use(express.json());

//for socket connection
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

//storing user with socket id//generally we use redish database for that
userSocketMap = {};

//utility function
function getAllClients(roomId) {
	return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
		(socketId) => {
			return {
				socketId,
				username: userSocketMap[socketId].username,
			};
		}
	);
}

//io is the socket server
io.on("connection", (socket) => {
	//console.log('socket connected', socket.id);
	socket.on(ACTIONS.JOIN, ({ username, roomId }) => {
		userSocketMap[socket.id] = { username, roomId };
		// console.log(userSocketMap);

		//joining socket user to new room or existing room /if exist
		socket.join(roomId);
		const clints = getAllClients(roomId);
		//console.log(clints);
		clints.forEach((client) => {
			let socketId = client.socketId;
			io.to(socketId).emit(ACTIONS.JOINED, {
				username: username,
				socketId: socket.id,
				clints,
			});
		});
	});

	socket.on(ACTIONS.CODE_CHANGE, ({ code, roomId }) => {
	socket.in(roomId).emit(ACTIONS.CODE_CHANGE, {
			code,
		});
	});

	socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
		io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
				code,
			});
		});



	socket.on("disconnecting", () => {
		const rooms = [...socket.rooms];
		rooms.forEach((roomId) => {
			socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
				username: userSocketMap[socket.id]?.username,
				socketId: socket.id,
			});
		});
		delete userSocketMap[socket.id];
		socket.leave();
	});
});

server.listen(process.env.PORT || 8000, () => {
	console.log("http://localhost:5000/");
});
