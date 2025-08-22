import React from "react";

interface CurrencyDisplayProps {
    amount: number;
    currencyCode?: string;
    currencySymbol?: string;
    className?: string;
    showCode?: boolean;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
    amount,
    currencyCode = "MYR",
    currencySymbol = "RM",
    className = "",
    showCode = false,
}) => {
    const formatAmount = (amount: number, code: string, symbol: string) => {
        const formattedAmount = new Intl.NumberFormat("en-US", {
            minimumFractionDigits: code === "JPY" ? 0 : 2,
            maximumFractionDigits: code === "JPY" ? 0 : 2,
        }).format(amount);

        // Malaysian Ringgit format: RM 100.00
        if (code === "MYR") {
            return `RM ${formattedAmount}`;
        }

        // Other currencies: $100.00, €100.00, etc.
        return `${symbol}${formattedAmount}`;
    };

    const displayText = formatAmount(amount, currencyCode, currencySymbol);

    if (showCode) {
        return (
            <span className={className}>
                {displayText} ({currencyCode})
            </span>
        );
    }

    return <span className={className}>{displayText}</span>;
};

export default CurrencyDisplay;
