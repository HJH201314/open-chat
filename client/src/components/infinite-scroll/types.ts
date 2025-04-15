export type InfiniteScrollState = {
  state: 'running' | 'stopped';
  pause: () => void;
  resume: () => void;
  load: () => void;
};