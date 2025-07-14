// resources/js/components/flash-toast.tsx
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export default function FlashToast() {
    const { props } = usePage<{
        flash?: {
            success?: string;
            error?: string;
        };
    }>();

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash?.success, props.flash?.error]);

    return null; // No UI to render

}
