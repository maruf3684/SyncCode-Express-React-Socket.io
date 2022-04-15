import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { validate } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const useHomeUtils = () => {
	const [roomId, setRoomId] = useState("");
	const [userName, setUserName] = useState("");
	const nevigate = useNavigate();

	const createNewRoom = (e) => {
		e.preventDefault();
		const roomId = uuidv4();
		setRoomId(roomId);
		toast.success("Room created successfully");
	};

	const joinRoom = () => {
		if (
			!roomId ||
			!userName ||
			validate(roomId) === false ||
			userName.length <= 3 ||
			userName.length >= 9
		) {
			toast.error("Please enter Valid roomId and UserName to join room");
			return;
		}

		//redirect
		nevigate(`/editor/${roomId}`, {
			state: {
				userName,
			},
		});
		toast.success("Room joined successfully");
	};

	const handleInputInter = (e) => {
		if (e.code === "Enter") {
			joinRoom();
		}
	};

	return {
		roomId,
		setRoomId,
		userName,
		setUserName,
		createNewRoom,
		joinRoom,
		handleInputInter,
	};
};

export default useHomeUtils;
