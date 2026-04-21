import nodemailer from 'nodemailer';

let transporterPromise = null;

async function getTransporter() {
	if (!transporterPromise) {
		transporterPromise = nodemailer.createTestAccount().then(testAccount => {
			return nodemailer.createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false,
				auth: {
					user: testAccount.user,
					pass: testAccount.pass
				}
			});
		});
	}
	return transporterPromise;
}

export async function sendWelcomeMail(email, username) {
	const transporter = await getTransporter();

	const info = await transporter.sendMail({
		from: '"Secure Portal" <no-reply@secureportal.com>',
		to: email,
		subject: 'Welcome to Secure Portal',
		text: `Hello ${username}, your account has been created.`,
		html: `<b>Hello ${username}</b><br>Your account has been created successfully.`
	});

	console.log('Email sent:', info.messageId);
	console.log('Preview URL:', nodemailer.getTestMessageUrl(info));

	return {
		messageId: info.messageId,
		preview: nodemailer.getTestMessageUrl(info)
	};
}