"use strict";

/**
 *
 *
 */

const express 	 = require("express");
const http 		 = require("http");
const bodyParser = require("body-parser");
const oauthserver = require("oauth2-server");
const jwt 		= require("jsonwebtoken");

const OAuthModel = require("./src/oauth-model");

const controller = require("./src/controller");

// express
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	
	return (req.method === "OPTIONS") ? res.end() : next();
});

// OAuth config
app.oauth = oauthserver({
	model: OAuthModel,
	grants: ["password"],
	debug: false,
	accessTokenLifetime: OAuthModel.accessTokenLifetime
});

// Handle token grant requests
app.all("/oauth/token", app.oauth.grant());

// Error handling
app.use(app.oauth.errorHandler());

// JWT midleware
app.use(function(req, res, next) {
	var accessToken = req.header('Authorization');

	if(accessToken) {
		try {
			accessToken = accessToken.split(' ');
			req.user = jwt.verify(accessToken[1], OAuthModel.accessTokenSecret);
		}
		catch(err) {
			return res.status(401).json({
				error: "Unathorized"
			});
		}
	}
	else {
		return res.status(401).json({
			error: "Authorization required"
		});
	}

	return next();
});

// resource api
app.get("/api/test", controller.index);

// server config
const server = http.Server(app);
const port = process.env.PORT || 3000;

server.listen(port, function () {
    console.info("Server running at port: " + port);
});