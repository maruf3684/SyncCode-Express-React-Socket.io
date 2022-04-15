import React from "react";
import useHomeUtils from "../hooks/useHomeUtils";

const HomePage = () => {
	const {
		roomId,
		setRoomId,
		userName,
		setUserName,
		createNewRoom,
		joinRoom,
		handleInputInter,
	} = useHomeUtils();

	return (
		<div className="homePageWrapper">
			<div className="fromWrapper">
				<img className="homePagelogo" src="/code-sync.png" alt="logo" />
				<h4 className="mainLabel">Paste Invitation Room Id</h4>
				<div className="inputgroup">
					<input
						className="inputBox"
						type="text"
						onChange={(e) => setRoomId(e.target.value)}
						value={roomId}
						placeholder="Room Id"
						onKeyUp={handleInputInter}
					/>
					<input
						className="inputBox"
						type="text"
						placeholder="Username (minimum 4 characters)"
						value={userName}
						onChange={(e) => setUserName(e.target.value)}
						onKeyUp={handleInputInter}
					/>
					<button onClick={joinRoom} className="btn joinBtn">
						join
					</button>
					<span className="createInfo">
						if you don't have a room id, create one &nbsp;
						<a onClick={createNewRoom} className="check" href="/#">
							create
						</a>
					</span>
				</div>
			</div>
			<footer>
				<h4>
					Built with{" "}
					<span role="img" aria-label="heart">
						❤️
					</span>{" "}
					by <a href="/#">Maruf Hasan</a>
				</h4>
			</footer>
		</div>
	);
};

export default HomePage;
