const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
var cors = require("cors");
const morgan = require("morgan");
const ACTIONS = require("./Actions");
const axios = require("axios");
//middlewere
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());

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

app.post("/code", async (req, res) => {
	let language = req.body.language;
	

	let value = { language: "nodejs", versionIndex: "4" };

	if (language === "javascript") {
		value.language = "nodejs";
		value.versionIndex = "4";
	} else if (language === "python") {
		value.language = "python3";
		value.versionIndex = "4";
	}

	let program = {
		script: req.body.code,
		language: value.language,
		versionIndex: value.versionIndex,
		clientId: "ce061c24b93f9284909c01fa01ea20d9",
		clientSecret:
			"a36c92bfcec438f0d5737721cc1e32882a02820535fab4edb9de21e750073f95",
	};

	axios({
		method: "post",
		url: "https://api.jdoodle.com/v1/execute",
		data: program,
	})
		.then((response) => {
			res.send(response.data);
			//res.send("success")
		})
		.catch((err) => {
			console.log("Error Happening");
			console.log(err);
			res.send("Some Error");
		});
});

server.listen(process.env.PORT || 8080, () => {
	console.log(`http://localhost:${process.env.PORT}/`);
});
//https://api.jdoodle.com/v1/execute