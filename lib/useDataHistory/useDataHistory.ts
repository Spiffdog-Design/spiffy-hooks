import { useReducer } from 'react';

interface State<T> {
  past: T[];
  data: T;
  future: T[];
}

interface Action<T> {
  type: string;
  value?: T;
}

const ACTION_TYPES = {
  CHANGE: 'CHANGE',
  UNDO: 'UNDO',
  REDO: 'REDO',
} as const;

const getDefaultState = <T>(value: T): State<T> => ({ past: [], data: value, future: [] });

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  const { past, data, future } = state;
  switch (action.type) {
    case ACTION_TYPES.CHANGE:
      return {
        past: [...past, data],
        data: action.value as T,
        future: [],
      };
    case ACTION_TYPES.UNDO:
      if (past.length === 0) return state;
      return {
        past: past.slice(0, -1),
        data: past[past.length - 1],
        future: [data, ...future],
      };
    case ACTION_TYPES.REDO:
      if (future.length === 0) return state;
      return {
        past: [...past, data],
        data: future[0],
        future: future.slice(1),
      };
    default:
      return state;
  }
};

export function useHistory<T>(initialValue: T) {
  const [state, dispatch] = useReducer(reducer, getDefaultState(initialValue));
  const { past, data, future } = state;

  const redo = () => {
    dispatch({ type: ACTION_TYPES.REDO });
  };

  const set = (value: T) => {
    dispatch({ type: ACTION_TYPES.CHANGE, value });
  };

  const undo = () => {
    dispatch({ type: ACTION_TYPES.UNDO });
  };

  return { data, history: { past, future }, actions: { redo, set, undo } };
}
