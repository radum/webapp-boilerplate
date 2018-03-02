import now from 'lodash/now';

import logger from './lib/logger';

class b {
	constructor() {
		logger.log(`Module b initialized! ${now()}`);
	}
}

export default b;
