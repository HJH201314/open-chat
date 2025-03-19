import type { ToastProps } from './types';
import ToastManager from '@/components/toast/ToastManager.ts';

function showToast(props: ToastProps) {
  ToastManager.show(props);
}

export function quickToast(text: string) {
  showToast({ text, position: 'top' });
}

export default showToast;
