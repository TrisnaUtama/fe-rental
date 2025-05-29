let onConfirmCallback: (() => void) | null = null;

export const setConfirmCallback = (cb: () => void) => {
  onConfirmCallback = cb;
};

export const callConfirmCallback = () => {
  onConfirmCallback?.();
  onConfirmCallback = null;
};
