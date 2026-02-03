const { Router } = require('express');

// guaranteed to get dependencies
const auth = require('./routes/auth');
const fee = require('./routes/fee');
const log = require('./routes/log');
const mess = require('./routes/mess');
const admin = require('./routes/admin'); // Pre-emptive import

module.exports = () => {
	const app = Router();
	
    auth(app);
    fee(app);
    log(app);
    mess(app);
    admin(app);

	return app;
}
