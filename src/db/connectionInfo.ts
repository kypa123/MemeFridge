import * as configFile from '../config/index.ts';

const connectionInfo = configFile.default.postgresURL;

export default connectionInfo;
