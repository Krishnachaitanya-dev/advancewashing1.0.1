
import React from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Check, AlertCircle, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface EmojiMap {
  [key: string]: React.ReactNode;
}

export function NotificationToast() {
  const { toasts } = useToast();

  // Map notification types to emojis/icons
  const emojiMap: EmojiMap = {
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, type, ...props }) {
        // Default to 'info' if type is not provided
        const notificationType = (type as NotificationType) || 'info';
        const icon = emojiMap[notificationType] || emojiMap.info;

        return (
          <Toast 
            key={id} 
            {...props}
            className="bg-white text-black rounded-xl border border-gray-100 shadow-lg"
          >
            <div className="flex items-start gap-3 p-2">
              <div className="flex-shrink-0 bg-slate-50 rounded-full p-2">
                {icon}
              </div>
              <div className="flex-1">
                {title && <ToastTitle className="font-semibold text-gray-800">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-gray-600 text-sm mt-1">
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            <ToastClose className="text-gray-400 hover:text-gray-600" />
          </Toast>
        )
      })}
      <ToastViewport className="p-4 md:p-6 z-50" />
    </ToastProvider>
  )
}

// Enhanced toast function with emoji support
export function showNotification(
  title: string, 
  description?: string, 
  type: NotificationType = 'info'
) {
  const { toast } = useToast();
  toast({ title, description, type });
}
