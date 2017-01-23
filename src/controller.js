"use strict";

/**
 *
 *
 */

module.exports = {
	/**
	 *
	 *
	 */
	index: function(req, res, next) {
		return res.status(200).json({
			data: "HELLO WORLD!"
		});
	}
};