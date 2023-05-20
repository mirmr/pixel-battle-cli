import { ForwardedRef } from 'react';
import { Grid } from './types';

export const minmax = (min: number, value: number, max: number) => {
  return Math.min(Math.max(min, value), max);
};

export const satisfiesMinmax = (min: number, value: number, max: number) => {
  return minmax(min, value, max) === value;
};

export const setForwardingRef = <T>(ref: ForwardedRef<T>, value: T) => {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null) {
    ref.current = value;
  }
};

export const setGridIndicies = (grid: string[][]): Grid => {
  return grid.map((row, rowInd) => {
    return row.map((color, colInd) => ({ colInd, rowInd, color }));
  });
};

export const isValidDateString = (dateString: string) => {
  try {
    new Date(dateString).toISOString();
    return true;
  } catch {
    return false;
  }
};

export const removeMsIsoDateString = (dateString: string) => {
  return `${dateString.slice(0, -5)}Z`;
};
