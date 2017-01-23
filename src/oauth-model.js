"use strict";

/**
 *
 *
 */

const jwt 	= require("jsonwebtoken");

const User 	 = require("./users");
const Client = require("./clients");

const Model = {
	/**
	 *
	 */
	accessTokenSecret: 'secret',
	
	/**
	 *
	 */
	accessTokenLifetime: 600,
	
	/**
	 *
	 *
	 */
	getAccessToken: function (bearerToken, callback) {
		try {
			var decoded = jwt.verify(bearerToken, Model.accessTokenSecret, { 
				ignoreExpiration: true
			});

			callback(null, {
				accessToken: bearerToken,
				userId: decoded.id,
				expires: new Date(decoded.exp * 1000)
			});

			return true;
		} catch(err) {
			console.error(err);
			callback(null, false);
			return false;
		}
	},

	/**
	 *
	 *
	 */
	saveAccessToken: function (token, clientId, expires, user, callback) {
		// no need to save
		callback();
		return true;
	},

	/**
	 *
	 *
	 */
	generateToken: function (type, req, callback) {
		if(type === "refreshToken") {
			callback();
			return null;
		}

		try {
			const payload = {
				id: req.user.id,
				role: req.user.role
			};

			const token = jwt.sign(payload, Model.accessTokenSecret, {
				algorithm: "HS256",
				expiresIn: Model.accessTokenLifetime,
				subject: req.client.clientId
			});

			callback(null, token);
			return true;
		}
		catch(err) {
			console.error(err);
			callback(err);	
			return false;	  	
		}
	},

	/**
	 *
	 *
	 */
	// saveRefreshToken: function (token, clientId, expires, user, callback) {

	// },

	/**
	 *
	 *
	 */
	// getRefreshToken: function (refreshToken, callback) {

	// },

	/**
	 *
	 *
	 */
	// revokeRefreshToken (refreshToken, callback) {

	// },

	/**
	 *
	 *
	 */
	getClient: function (clientId, clientSecret, callback) {
		try {
			var result = Client.filter(function(obj) {
				if(clientSecret === null) {
					return obj.client_id === clientId;
				}
				else {
					return obj.client_id === clientId && obj.client_secret === clientSecret;
				}
			});

			if(result.length > 0) {
				callback(null, {
		    		clientId: result[0].client_id,
		    		clientSecret: result[0].client_secret,
		    		redirectUri: result[0].redirectUri
		    	});

		    	return true;
			}
			else {
				callback();
				return false;
			}
		}
		catch(err) {
			console.error(err);
			callback(err);
			return false;
		}
	},

	/**
	 *
	 *
	 */
	grantTypeAllowed: function (clientId, grantType, callback) {
		// Authorize all clients to use all grants.
		callback(null, true);
	},
	
	/**
	 *
	 *
	 */
	getUser: function (username, password, callback) {
		try {
			var result = User.filter(function(obj) {
				return obj.username === username && password === password;
			});

			if(result.length > 0) {
				callback(null, {
		    		id: result[0].id,
		    		role: result[0].role
		    	});

		    	return true;
			}
			else {
				callback();
				return null;
			}
		}
		catch(err) {
			console.error(err);
			callback(err);
			return false;
		}
	}
};

module.exports = Model;