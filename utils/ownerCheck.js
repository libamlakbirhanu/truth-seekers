module.exports = async function docBelongsToCurrentUser(model, did, uid) {
	const doc = await model.findById(did).find({
		author: { $ne: uid },
	});

	if (doc.length) return false;
	return true;
};
