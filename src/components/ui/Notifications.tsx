import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { useUIStore } from '../../stores';
import { useEffect } from 'react';

export const Notifications = () => {
  const notifications = useUIStore(state => state.notifications);
  const removeNotification = useUIStore(state => state.removeNotification);

  useEffect(() => {
    notifications.forEach((notification, index) => {
      const toastOptions: ToastOptions = {
        duration: 3000,
        onDismiss: () => removeNotification(index)
      };
      toast(notification, toastOptions);
    });
  }, [notifications]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white',
        style: {
          background: 'var(--toast-background)',
          color: 'var(--toast-color)',
        },
      }}
    />
  );
}; 