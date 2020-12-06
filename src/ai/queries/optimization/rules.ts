import { Constants } from '../../../util/constants';
import { QueryOptimizerRule } from './query-optimizer';

export const preferFewerMoves: QueryOptimizerRule = (r, o) =>
  r.moves?.length < o.moves?.length;

export const preferMovesNearCenter: QueryOptimizerRule = (r, o) =>
  r.moves?.length === o.moves?.length &&
  Math.abs(Constants.middleColumnIndex - r.moves?.[0]) <
    Math.abs(Constants.middleColumnIndex - o.moves?.[0]);
