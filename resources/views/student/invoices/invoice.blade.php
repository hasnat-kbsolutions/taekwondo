<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #{{ $invoiceNumber }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            color: #1f2937;
            background: #ffffff;
            line-height: 1.5;
        }

        .invoice-container {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        /* Header Section */
        .header {
            background: #f3f4f6;
            border-bottom: 2px solid #e5e7eb;
            padding: 24px;
        }

        .header-top {
            display: table;
            width: 100%;
            margin-bottom: 16px;
        }

        .header-left {
            display: table-cell;
            vertical-align: top;
            width: 70%;
        }

        .header-right {
            display: table-cell;
            vertical-align: top;
            width: 30%;
            text-align: right;
        }

        .club-info {
            display: inline-block;
            vertical-align: middle;
        }

        .club-info h1 {
            font-size: 18px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 4px;
        }

        .club-info p {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
        }

        .invoice-title h2 {
            font-size: 18px;
            font-weight: bold;
            color: #111827;
            margin-bottom: 4px;
        }

        .invoice-title p {
            font-size: 12px;
            color: #6b7280;
            margin: 0;
        }

        /* Meta Info */
        .meta-info {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #d1d5db;
        }

        .meta-item {
            display: table-cell;
            width: 33.33%;
        }

        .meta-item:first-child {
            text-align: left;
            padding-right: 10px;
        }

        .meta-item:nth-child(2) {
            text-align: center;
            padding: 0 10px;
        }

        .meta-item:last-child {
            text-align: right;
            padding-left: 10px;
        }

        .meta-label {
            display: block;
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 4px;
        }

        .meta-value {
            display: block;
            font-size: 13px;
            font-weight: 600;
            color: #111827;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
        }

        .status-paid {
            background: #dcfce7;
            color: #166534;
        }

        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }

        /* Content Section */
        .content {
            padding: 24px;
        }

        /* Details Section */
        .details-section {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 24px;
        }

        .detail-box {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }

        .detail-box:first-child {
            text-align: left;
            padding-right: 24px;
        }

        .detail-box:last-child {
            text-align: right;
        }

        .detail-box h3 {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }

        .detail-content p {
            font-size: 12px;
            color: #4b5563;
            margin-bottom: 4px;
        }

        .detail-content .name {
            font-size: 13px;
            font-weight: 600;
            color: #111827;
        }

        /* Payment Details Table */
        .payment-details {
            margin-bottom: 24px;
        }

        .payment-details h3 {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            overflow: hidden;
        }

        th {
            background: #f9fafb;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            border-bottom: 1px solid #e5e7eb;
        }

        th:last-child {
            text-align: right;
        }

        td {
            padding: 12px;
            font-size: 12px;
            color: #4b5563;
            border-bottom: 1px solid #e5e7eb;
        }

        td:last-child {
            text-align: right;
            font-weight: 600;
            color: #111827;
        }

        tbody tr:last-child {
            background: #f3f4f6;
            border-top: 2px solid #d1d5db;
        }

        tbody tr:last-child td {
            font-weight: bold;
            font-size: 14px;
            color: #111827;
        }

        /* Bank Information */
        .bank-info {
            margin-bottom: 24px;
        }

        .bank-info h3 {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }

        .bank-grid {
            display: table;
            width: 100%;
            border-spacing: 0;
            margin-top: 8px;
        }

        .bank-card {
            display: table-cell;
            width: 50%;
            padding-right: 12px;
            vertical-align: top;
        }

        .bank-card:last-child {
            padding-right: 0;
        }

        .bank-card-inner {
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            background: #f9fafb;
        }

        .bank-card h4 {
            font-size: 13px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
        }

        .bank-card p {
            font-size: 11px;
            color: #4b5563;
            margin-bottom: 4px;
        }

        .bank-label {
            font-weight: 600;
            color: #111827;
        }

        /* Notes */
        .notes {
            padding: 12px;
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            border-radius: 4px;
            margin-bottom: 24px;
        }

        .notes h4 {
            font-size: 12px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
        }

        .notes p {
            font-size: 12px;
            color: #1e40af;
        }

        /* Footer */
        .footer {
            border-top: 1px solid #e5e7eb;
            padding: 16px 24px;
            background: #f3f4f6;
            text-align: right;
        }

        .footer h4 {
            font-size: 12px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
        }

        .footer p {
            font-size: 11px;
            color: #6b7280;
        }

        .print-info {
            font-size: 11px;
            color: #6b7280;
            padding: 12px 24px;
            border-top: 1px solid #e5e7eb;
            background: #f3f4f6;
        }
    </style>
</head>

<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="header-top">
                <div class="header-left">
                    <div class="club-info" style="display: table; width: 100%;">
                        @if (isset($logoPath) && $logoPath)
                            <div style="display: table-cell; vertical-align: middle; padding-right: 16px;">
                                <img src="{{ $logoPath }}" alt="{{ $club->name ?? 'Club' }} Logo"
                                    style="max-width: 80px; max-height: 80px; object-fit: contain;">
                            </div>
                        @else
                            <div style="display: table-cell; vertical-align: middle;">
                                <h1>{{ $club->name ?? 'Taekwondo Club' }}</h1>
                                @if ($organization->name)
                                    <p>{{ $organization->name }}</p>
                                @endif
                            </div>
                        @endif
                    </div>
                </div>
                <div class="header-right">
                    <div class="invoice-title">
                        <h2>INVOICE</h2>
                        <p>#{{ $invoiceNumber }}</p>
                    </div>
                </div>
            </div>

            <!-- Meta Info -->
            <div class="meta-info">
                <div class="meta-item">
                    <span class="meta-label">Invoice Date</span>
                    <span class="meta-value">{{ $invoiceDate }}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Payment Month</span>
                    <span class="meta-value">{{ $payment->payment_month }}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Status</span>
                    <span class="status-badge status-{{ $payment->status }}">
                        {{ $payment->status }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Details Section -->
            <div class="details-section">
                <div class="detail-box">
                    <h3>From</h3>
                    <div class="detail-content">
                        @if (!isset($logoPath) || !$logoPath)
                            <p class="name">{{ $club->name ?? 'Taekwondo Club' }}</p>
                        @endif
                        @if ($club->street)
                            <p>{{ $club->street }}</p>
                        @endif
                        @if ($club->city && $club->country)
                            <p>{{ $club->city }}, {{ $club->country }}</p>
                        @endif
                        @if ($club->phone)
                            <p>{{ $club->phone }}</p>
                        @endif
                        @if ($club->email)
                            <p>{{ $club->email }}</p>
                        @endif
                    </div>
                </div>
                <div class="detail-box">
                    <h3>Bill To</h3>
                    <div class="detail-content">
                        <p class="name">{{ $student->name }} {{ $student->surname }}</p>
                        <p>Student ID: {{ $student->uid }}</p>
                        @if ($student->email)
                            <p>{{ $student->email }}</p>
                        @endif
                        @if ($student->phone)
                            <p>{{ $student->phone }}</p>
                        @endif
                    </div>
                </div>
            </div>

            <!-- Payment Details -->
            <div class="payment-details">
                <h3>Payment Details</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Method</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        @if (count($items) > 0)
                            @foreach ($items as $item)
                                <tr>
                                    <td>{{ $item->description ?? 'Payment' }}</td>
                                    <td>{{ $payment->method ?? 'N/A' }}</td>
                                    <td>{{ $currencySymbol }} {{ $itemAmount }}</td>
                                </tr>
                            @endforeach
                        @else
                            <tr>
                                <td>Monthly Payment</td>
                                <td>{{ $payment->method ?? 'N/A' }}</td>
                                <td>{{ $currencySymbol }} {{ $totalAmount }}</td>
                            </tr>
                        @endif
                        <tr>
                            <td colspan="2">Total Amount ({{ $currency->code }})</td>
                            <td>{{ $currencySymbol }} {{ $totalAmount }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bank Information -->
            @if (count($bankInfo) > 0)
                <div class="bank-info">
                    <h3>Bank Information</h3>
                    <div class="bank-grid">
                        @foreach ($bankInfo as $bank)
                            <div class="bank-card">
                                <div class="bank-card-inner">
                                    <h4>{{ $bank['bank_name'] ?? 'N/A' }}</h4>
                                    <p><span class="bank-label">Account Name:</span>
                                        {{ $bank['account_name'] ?? 'N/A' }}</p>
                                    <p><span class="bank-label">Account Number:</span>
                                        {{ $bank['account_number'] ?? 'N/A' }}</p>
                                    @if (isset($bank['iban']))
                                        <p><span class="bank-label">IBAN:</span> {{ $bank['iban'] }}</p>
                                    @endif
                                    @if (isset($bank['swift_code']))
                                        <p><span class="bank-label">SWIFT Code:</span> {{ $bank['swift_code'] }}</p>
                                    @endif
                                    @if (isset($bank['branch']))
                                        <p><span class="bank-label">Branch:</span> {{ $bank['branch'] }}</p>
                                    @endif
                                    @if (isset($bank['currency']))
                                        <p><span class="bank-label">Currency:</span> {{ $bank['currency'] }}</p>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <!-- Notes -->
            @if ($payment->notes)
                <div class="notes">
                    <h4>Notes:</h4>
                    <p>{{ $payment->notes }}</p>
                </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <h4>Thank You!</h4>
            <p>We appreciate your business and continued support.</p>
        </div>

        <!-- Print Info -->
        <div class="print-info">
            Generated on {{ now()->format('F d, Y') }}
        </div>
    </div>
</body>

</html>
