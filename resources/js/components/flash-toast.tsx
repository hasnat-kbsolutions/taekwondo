// resources/js/components/flash-toast.tsx
import { useEffect } from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";

export default function FlashToast() {
    const { props } = usePage<{
        flash?: {
            success?: string;
            error?: string | string[];
            import_log?: any[];
        };
    }>();

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            const errors = Array.isArray(props.flash.error)
                ? props.flash.error
                : [props.flash.error];
            errors.forEach((err) => toast.error(err));
        }
        if (props.flash?.import_log) {
            props.flash.import_log.forEach((log: any) => {
                if (log.status === "success") {
                    toast.success(`✅ ${log.message}`);
                } else if (log.status === "failed") {
                    toast.error(`❌ ${log.message}`);
                } else if (log.summary) {
                    toast(
                        `Import Summary: Total: ${log.total}, Success: ${
                            log.success
                        }, Failed: ${log.failed}, Percentage: ${
                            log.percentage
                        }%${log.error ? ", Error: " + log.error : ""}`,
                        { style: { fontWeight: "bold" } }
                    );
                }
            });
        }
    }, [props.flash?.success, props.flash?.error, props.flash?.import_log]);

    return null;
}
