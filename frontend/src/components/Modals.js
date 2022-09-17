import React from "react";

const Modals = (props) => {
	const { showModal, close, output } = props;

	if (showModal === false) return null;
	return (
		<div className="modlasOuter">
			<div className="modalContent">
				<div
					className="mainCode"
					dangerouslySetInnerHTML={{ __html: output }}
				></div>

				<button className="crossButton" onClick={close}>
					X
				</button>
			</div>
		</div>
	);
};

export default Modals;
