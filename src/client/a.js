import now from 'lodash/now';

import logger from './lib/logger';

class a {
	constructor() {
		logger.log(`Module a initialized! ${now()}`);
	}
}

export default a;
