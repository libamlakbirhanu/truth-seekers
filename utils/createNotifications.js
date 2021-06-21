const Notification = require('./../models/Notification');

module.exports = async function createNotifications(
	message,
	targetDoc,
	sender
) {
	const data = {
		sender,
		targetDocument: targetDoc,
		message,
	};

	return await Notification.create(data);
};
