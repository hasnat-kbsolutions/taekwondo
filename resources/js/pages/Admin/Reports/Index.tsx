import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layouts/authenticated-layout";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
    Building,
    Users,
    GraduationCap,
    DollarSign,
    Calendar,
    Award,
    Star,
    BarChart3,
    FileText,
    TrendingUp,
    Download,
    Eye,
    CheckCircle,
    Clock,
} from "lucide-react";

interface Props {
    summary: {
        total_organizations: number;
        total_clubs: number;
        total_students: number;
        total_instructors: number;
        total_supporters: number;
        total_revenue: number;
        pending_payments: number;
        total_certifications: number;
        total_ratings: number;
    };
    // Add financial data props
    payments?: any[];
    organizationPayments?: any[];
    monthlyTrends?: any[];
    organizations?: any[];
    amountsByCurrency?: Record<string, number>;
    defaultCurrencyCode?: string;
}

export default function ReportsIndex({
    summary,
    payments = [],
    organizationPayments = [],
    monthlyTrends = [],
    organizations = [],
    amountsByCurrency = {},
    defaultCurrencyCode = "MYR",
}: Props) {
    const [reportType, setReportType] = useState("overview");

    // Utility function to safely format amounts
    const formatAmount = (amount: any) => {
        return (Number(amount) || 0).toFixed(2);
    };

    // Ensure all summary values are numbers with fallbacks
    const safeSummary = {
        total_organizations: Number(summary.total_organizations) || 0,
        total_clubs: Number(summary.total_clubs) || 0,
        total_students: Number(summary.total_students) || 0,
        total_instructors: Number(summary.total_instructors) || 0,
        total_supporters: Number(summary.total_supporters) || 0,
        total_revenue: Number(summary.total_revenue) || 0,
        pending_payments: Number(summary.pending_payments) || 0,
        total_certifications: Number(summary.total_certifications) || 0,
        total_ratings: Number(summary.total_ratings) || 0,
    };

    const reportTypes = [
        {
            title: "Overview",
            description: "System overview and key metrics",
            icon: (
                <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ),
            value: "overview",
            color: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50",
        },
        {
            title: "Financial",
            description: "Financial analysis and payment trends",
            icon: (
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            ),
            value: "financial",
            color: "bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50",
        },
        {
            title: "Organizations",
            description: "Organization performance and metrics",
            icon: (
                <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            ),
            value: "organizations",
            color: "bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50",
        },
    ];

    const quickStats = [
        {
            label: "Total Revenue",
            value: (
                <div className="space-y-1">
                    <div className="text-lg font-bold">
                        {defaultCurrencyCode === "MYR"
                            ? "RM"
                            : defaultCurrencyCode}{" "}
                        {formatAmount(amountsByCurrency[defaultCurrencyCode])}
                    </div>
                    {Object.keys(amountsByCurrency).length > 1 && (
                        <div className="text-xs text-muted-foreground space-y-1">
                            {Object.entries(amountsByCurrency)
                                .filter(
                                    ([code]) => code !== defaultCurrencyCode
                                )
                                .map(([code, amount]) => (
                                    <div
                                        key={code}
                                        className="flex justify-between"
                                    >
                                        <span>{code}:</span>
                                        <span>{formatAmount(amount)}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ),
            icon: (
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            ),
            url: route("admin.payments.index"),
        },
        {
            label: "Total Organizations",
            value: safeSummary.total_organizations,
            icon: (
                <Building className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            ),
            url: route("admin.organizations.index"),
        },
        {
            label: "Total Clubs",
            value: safeSummary.total_clubs,
            icon: (
                <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
            ),
            url: route("admin.clubs.index"),
        },
        {
            label: "Total Students",
            value: safeSummary.total_students,
            icon: (
                <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            ),
            url: route("admin.students.index"),
        },
        {
            label: "Total Instructors",
            value: safeSummary.total_instructors,
            icon: (
                <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            ),
            url: route("admin.instructors.index"),
        },
        {
            label: "Total Supporters",
            value: safeSummary.total_supporters,
            icon: (
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            ),
            url: route("admin.supporters.index"),
        },
    ];

    // Financial summary cards
    const financialSummary = [
        {
            label: "Total Revenue",
            value: (
                <div className="space-y-1">
                    <div className="text-lg font-bold">
                        {defaultCurrencyCode === "MYR"
                            ? "RM"
                            : defaultCurrencyCode}{" "}
                        {formatAmount(amountsByCurrency[defaultCurrencyCode])}
                    </div>
                    {Object.keys(amountsByCurrency).length > 1 && (
                        <div className="text-xs text-muted-foreground space-y-1">
                            {Object.entries(amountsByCurrency)
                                .filter(
                                    ([code]) => code !== defaultCurrencyCode
                                )
                                .map(([code, amount]) => (
                                    <div
                                        key={code}
                                        className="flex justify-between"
                                    >
                                        <span>{code}:</span>
                                        <span>{formatAmount(amount)}</span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ),
            icon: (
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
            ),
            color: "text-green-600 dark:text-green-400",
        },
        {
            label: "Pending Payments",
            value: (
                <div className="text-lg font-bold">
                    {defaultCurrencyCode === "MYR" ? "RM" : defaultCurrencyCode}{" "}
                    {formatAmount(safeSummary.pending_payments)}
                </div>
            ),
            icon: (
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            ),
            color: "text-orange-600 dark:text-orange-400",
        },
        {
            label: "Total Payments",
            value: payments.length || 0,
            icon: (
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            ),
            color: "text-blue-600 dark:text-blue-400",
        },
        {
            label: "Paid Payments",
            value: payments.filter((p) => p.status === "paid").length || 0,
            icon: (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ),
            color: "text-green-600 dark:text-green-400",
        },
    ];

    const renderOverviewSection = () => (
        <div className="space-y-6">
            {/* Quick Stats */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground dark:text-muted-foreground">
                    System Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {quickStats.map((item) => (
                        <Link
                            key={item.label}
                            href={item.url}
                            className={`block group ${
                                item.label === "Total Revenue"
                                    ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                                    : ""
                            }`}
                        >
                            <Card className="text-center border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer hover:bg-accent/50 dark:hover:bg-accent/20">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-center mb-2">
                                        {item.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                                        {item.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground dark:text-muted-foreground group-hover:text-foreground transition-colors">
                                        {item.label}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Report Types */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground dark:text-muted-foreground">
                    Available Reports
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {reportTypes.map((report) => (
                        <Card
                            key={report.title}
                            className={`border-2 ${report.color} transition-all duration-200 hover:shadow-lg bg-card dark:bg-card cursor-pointer`}
                            onClick={() => setReportType(report.value)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    {report.icon}
                                    <CardTitle className="text-lg text-card-foreground">
                                        {report.title}
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                                    {report.description}
                                </p>
                                <div className="text-sm text-muted-foreground dark:text-muted-foreground">
                                    Click to view detailed{" "}
                                    {report.title.toLowerCase()} report
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFinancialSection = () => (
        <div className="space-y-6">
            {/* Financial Summary Cards */}
            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground dark:text-muted-foreground">
                    Financial Summary
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {financialSummary.map((stat) => (
                        <Card
                            key={stat.label}
                            className={`border-border bg-card ${
                                stat.label === "Total Revenue"
                                    ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                                    : ""
                            }`}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-card-foreground">
                                    {stat.label}
                                </CardTitle>
                                {stat.icon}
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-2xl font-bold ${stat.color}`}
                                >
                                    {stat.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Monthly Trends */}
            {monthlyTrends && monthlyTrends.length > 0 && (
                <Card className="border-border bg-card">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-card-foreground">
                            <TrendingUp className="h-5 w-5" />
                            Monthly Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {monthlyTrends.map((trend: any) => (
                                <div
                                    key={trend.month}
                                    className="p-4 border border-border rounded-lg bg-background"
                                >
                                    <div className="text-lg font-semibold mb-2 text-card-foreground">
                                        {trend.month}
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Total:
                                            </span>
                                            <span className="font-medium text-card-foreground">
                                                {trend.amounts_by_currency &&
                                                Object.keys(
                                                    trend.amounts_by_currency
                                                ).length > 0 ? (
                                                    <div className="space-y-1">
                                                        {Object.entries(
                                                            trend.amounts_by_currency
                                                        ).map(
                                                            ([
                                                                code,
                                                                amount,
                                                            ]) => (
                                                                <div
                                                                    key={code}
                                                                    className="text-right"
                                                                >
                                                                    {code ===
                                                                    "MYR"
                                                                        ? "RM"
                                                                        : code}{" "}
                                                                    {formatAmount(
                                                                        amount
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    `RM ${formatAmount(
                                                        trend.total_amount
                                                    )}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Paid:
                                            </span>
                                            <span className="font-medium text-green-600 dark:text-green-400">
                                                {trend.amounts_by_currency &&
                                                Object.keys(
                                                    trend.amounts_by_currency
                                                ).length > 0 ? (
                                                    <div className="space-y-1">
                                                        {Object.entries(
                                                            trend.amounts_by_currency
                                                        ).map(
                                                            ([
                                                                code,
                                                                amount,
                                                            ]) => (
                                                                <div
                                                                    key={code}
                                                                    className="text-right"
                                                                >
                                                                    {code ===
                                                                    "MYR"
                                                                        ? "RM"
                                                                        : code}{" "}
                                                                    {formatAmount(
                                                                        amount
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    `RM ${formatAmount(
                                                        trend.paid_amount
                                                    )}`
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Pending:
                                            </span>
                                            <span className="font-medium text-orange-600 dark:text-orange-400">
                                                {trend.amounts_by_currency &&
                                                Object.keys(
                                                    trend.amounts_by_currency
                                                ).length > 0 ? (
                                                    <div className="space-y-1">
                                                        {Object.entries(
                                                            trend.amounts_by_currency
                                                        ).map(
                                                            ([
                                                                code,
                                                                amount,
                                                            ]) => (
                                                                <div
                                                                    key={code}
                                                                    className="text-right"
                                                                >
                                                                    {code ===
                                                                    "MYR"
                                                                        ? "RM"
                                                                        : code}{" "}
                                                                    {formatAmount(
                                                                        amount
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    `RM ${formatAmount(
                                                        trend.pending_amount
                                                    )}`
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );

    const renderOrganizationsSection = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold mb-4 text-muted-foreground dark:text-muted-foreground">
                    Organization Performance
                </h2>
                {organizations && organizations.length > 0 ? (
                    <div className="space-y-6">
                        {organizations.map((org: any) => (
                            <Card
                                key={org.id}
                                className="border-border bg-card"
                            >
                                <CardHeader>
                                    <CardTitle className="text-card-foreground flex items-center gap-2">
                                        <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        {org.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Organization Level Stats */}
                                    <div className="mb-6">
                                        <h3 className="text-md font-semibold mb-3 text-muted-foreground dark:text-muted-foreground">
                                            Organization Overview
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="text-center p-3 bg-background rounded-lg border border-border">
                                                <div className="text-lg font-semibold text-primary">
                                                    {org.clubs_count || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Clubs
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-background rounded-lg border border-border">
                                                <div className="text-lg font-semibold text-primary">
                                                    {org.students_count || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Students
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-background rounded-lg border border-border">
                                                <div className="text-lg font-semibold text-primary">
                                                    {org.instructors_count || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Instructors
                                                </div>
                                            </div>
                                            <div className="text-center p-3 bg-background rounded-lg border border-border">
                                                <div className="text-lg font-semibold text-primary">
                                                    {org.revenue_by_currency &&
                                                    Object.keys(
                                                        org.revenue_by_currency
                                                    ).length > 0 ? (
                                                        <div className="space-y-1">
                                                            {Object.entries(
                                                                org.revenue_by_currency
                                                            ).map(
                                                                ([
                                                                    code,
                                                                    amount,
                                                                ]) => (
                                                                    <div
                                                                        key={
                                                                            code
                                                                        }
                                                                    >
                                                                        {code ===
                                                                        "MYR"
                                                                            ? "RM"
                                                                            : code}{" "}
                                                                        {formatAmount(
                                                                            amount
                                                                        )}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        `RM ${formatAmount(
                                                            org.revenue
                                                        )}`
                                                    )}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Revenue
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Club Level Details */}
                                    {org.clubs && org.clubs.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-md font-semibold mb-3 text-muted-foreground dark:text-muted-foreground">
                                                Club Details
                                            </h3>
                                            <div className="space-y-3">
                                                {org.clubs.map((club: any) => (
                                                    <div
                                                        key={club.id}
                                                        className="p-3 bg-background rounded-lg border border-border"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-card-foreground">
                                                                {club.name}
                                                            </h4>
                                                            <span className="text-sm text-muted-foreground">
                                                                {club.students_count ||
                                                                    0}{" "}
                                                                students
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div className="text-center">
                                                                <div className="font-semibold text-blue-600 dark:text-blue-400">
                                                                    {club.certifications_count ||
                                                                        0}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Certifications
                                                                </div>
                                                            </div>
                                                            <div className="text-center">
                                                                <div className="font-semibold text-orange-600 dark:text-orange-400">
                                                                    {club.pending_payments ||
                                                                        0}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    Pending
                                                                    Payments
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Student Level Certifications */}
                                    {org.students &&
                                        org.students.length > 0 && (
                                            <div>
                                                <h3 className="text-md font-semibold mb-3 text-muted-foreground dark:text-muted-foreground">
                                                    Student Certifications
                                                </h3>
                                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                                    {org.students.map(
                                                        (student: any) => (
                                                            <div
                                                                key={student.id}
                                                                className="flex items-center justify-between p-2 bg-background rounded border border-border"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <GraduationCap className="h-4 w-4 text-primary" />
                                                                    <span className="text-sm font-medium text-card-foreground">
                                                                        {
                                                                            student.name
                                                                        }
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        (
                                                                        {student
                                                                            .club
                                                                            ?.name ||
                                                                            "No Club"}
                                                                        )
                                                                    </span>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="text-sm font-semibold text-primary">
                                                                        {student.certifications_count ||
                                                                            0}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        Certifications
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-border bg-card">
                        <CardContent className="p-6 text-center text-muted-foreground">
                            No organization data available
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (reportType) {
            case "financial":
                return renderFinancialSection();
            case "organizations":
                return renderOrganizationsSection();
            default:
                return renderOverviewSection();
        }
    };

    return (
        <AuthenticatedLayout header="Reports Dashboard">
            <Head title="Reports Dashboard" />
            <div className="space-y-6">
                {/* Report Type Navigation */}
                <div className="flex flex-wrap gap-2">
                    {reportTypes.map((report) => (
                        <Button
                            key={report.value}
                            variant={
                                reportType === report.value
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => setReportType(report.value)}
                            className="border-border"
                        >
                            {report.icon}
                            <span className="ml-2">{report.title}</span>
                        </Button>
                    ))}
                </div>

                {/* Dynamic Content */}
                {renderContent()}
            </div>
        </AuthenticatedLayout>
    );
}
