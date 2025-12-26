
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PaymentRedirectModalProps {
    isOpen: boolean;
    message?: string;
}

const PaymentRedirectModal: React.FC<PaymentRedirectModalProps> = ({
    isOpen,
    message = "Please wait, you're being redirected to complete your payment..."
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="bg-vanta-blue-dark border-gray-800 text-center sm:max-w-md [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="text-vanta-text-light text-xl mb-4">Redirecting</DialogTitle>
                    <DialogDescription className="hidden">
                        Redirecting to payment gateway
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-8 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-vanta-neon-blue/20 blur-xl rounded-full"></div>
                        <Loader2 className="h-16 w-16 text-vanta-neon-blue animate-spin relative z-10" />
                    </div>

                    <p className="text-lg text-gray-300 font-medium max-w-[80%] mx-auto leading-relaxed animate-pulse">
                        {message}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentRedirectModal;
