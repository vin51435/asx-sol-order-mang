import { ErrorCodes } from '../libs/constants/errorCodes';
import { DeepFlatten } from '../utils/DeepFlatternTypes';

export type ErrorCodeType = DeepFlatten<typeof ErrorCodes>;
