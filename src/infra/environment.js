const DEFAULT_PORT = 3000;
const DEFAULT_HIGH_PORT = 3999;

export const BASE_PUB_PORT = process.env.BASE_PUB_PORT || DEFAULT_PORT;
export const HIGH_PUB_PORT = process.env.HIGH_PUB_PORT || DEFAULT_HIGH_PORT;

export const isLocal = (process.env.NODE_ENV === 'default' || process.env.NODE_ENV === undefined);
export const PUB_HOST_ADDRESS = process.env.PUB_HOST_ADDRESS || '127.0.0.1';
export const PUB_PORT = process.env.PUB_PORT || DEFAULT_PORT;