import responseMessages from '../libs/constants/responseMessages';
import { DeepFlatten } from '../utils/DeepFlatternTypes';

export type IResponseMessage = DeepFlatten<typeof responseMessages>;

