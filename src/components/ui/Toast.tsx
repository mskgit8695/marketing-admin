import { toast as sonnerToast, type ExternalToast } from "sonner";

export interface ToastOptions extends ExternalToast {
  title?: string;
  description?: string;
}

export const toast = {
  success(message: string, options?: ToastOptions) {
    return sonnerToast.success(message, options);
  },
  error(message: string, options?: ToastOptions) {
    return sonnerToast.error(message, options);
  },
  warning(message: string, options?: ToastOptions) {
    return sonnerToast.warning(message, options);
  },
  info(message: string, options?: ToastOptions) {
    return sonnerToast.info(message, options);
  },
  message(message: string, options?: ToastOptions) {
    return sonnerToast(message, options);
  },
  promise<T>(
    promise: Promise<T>,
    data: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) {
    return sonnerToast.promise(promise, data);
  },
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },
};
