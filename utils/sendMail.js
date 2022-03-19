const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const config = require("../config");

const credentials = config.mail.credentials;

const oAuth2Client = new google.auth.OAuth2(
	credentials.clientId,
	credentials.clientSecret,
	credentials.redirectURI
);
oAuth2Client.setCredentials({ refresh_token: credentials.refreshToken });

async function sendMail(to, subject, body) {
	try {
		const accessToken = await oAuth2Client.getAccessToken();

		const transport = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: "OAuth2",
				user: credentials.email,
				clientId: credentials.clientId,
				clientSecret: credentials.clientSecret,
				refreshToken: credentials.refreshToken,
				accessToken: accessToken,
			},
		});

		const mailOptions = {
			from: credentials.email,
			to: to,
			subject: subject,
			html: body,
		};

		const result = await transport.sendMail(mailOptions);
		return result;
	} catch (error) {
		return error;
	}
}

module.exports = sendMail;
