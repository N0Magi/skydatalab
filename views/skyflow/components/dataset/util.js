import { NUMBER_TYPES, STRING_TYPES } from './config';

export const isNumber = type => type && !!NUMBER_TYPES.find(item => item.toLowerCase() === type.toLowerCase()) || false;

export const isString = type => type && !!STRING_TYPES.find(item => item.toLowerCase() === type.toLowerCase()) || false;
