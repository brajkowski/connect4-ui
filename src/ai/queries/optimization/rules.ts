import { QueryOptimizerRule } from './query-optimizer';

export const preferFewerMoves: QueryOptimizerRule = (r, o) =>
  r.moves?.length < o.moves?.length;

export const preferMovesNearCenter: QueryOptimizerRule = (r, o) =>
  r.moves?.length === o.moves?.length &&
  Math.abs(3 - r.moves?.[0]) < Math.abs(3 - o.moves?.[0]);
