
import React from 'react';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { Check, AlertCircle, Info } from 'lucide-react';

export function NotificationToast() {
  const { toasts } = useToast();

  // Map variants to emojis/icons
  const getIcon = (variant: string | undefined, title: string) => {
    // Determine icon based on title content and variant
    if (title?.toLowerCase().includes('welcome') || title?.toLowerCase().includes('success') || title?.toLowerCase().includes('added')) {
      return <Check className="w-5 h-5 text-green-500" />;
    }
    if (variant === 'destructive' || title?.toLowerCase().includes('error') || title?.toLowerCase().includes('no services')) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        const icon = getIcon(variant, title as string);

        return (
          <Toast 
            key={id} 
            {...props}
            variant={variant}
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
