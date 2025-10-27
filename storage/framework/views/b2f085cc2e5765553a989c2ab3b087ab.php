<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice #<?php echo e($invoiceNumber); ?></title>
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

        .logo-section {
            display: inline-block;
            vertical-align: middle;
        }

        .logo {
            width: 56px;
            height: 56px;
            border-radius: 8px;
            object-fit: cover;
            border: 1px solid #e5e7eb;
            background: white;
            padding: 4px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 12px;
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
                    <div class="logo-section">
                        <?php if($club->logo): ?>
                            <img src="<?php echo e(public_path('storage/' . $club->logo)); ?>" alt="Logo" class="logo">
                        <?php else: ?>
                            <div class="logo" style="text-align: center; line-height: 48px; font-size: 24px;">🏢</div>
                        <?php endif; ?>
                        <div class="club-info">
                            <h1><?php echo e($club->name ?? 'Taekwondo Club'); ?></h1>
                            <?php if($organization->name): ?>
                                <p><?php echo e($organization->name); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
                <div class="header-right">
                    <div class="invoice-title">
                        <h2>INVOICE</h2>
                        <p>#<?php echo e($invoiceNumber); ?></p>
                    </div>
                </div>
            </div>

            <!-- Meta Info -->
            <div class="meta-info">
                <div class="meta-item">
                    <span class="meta-label">Invoice Date</span>
                    <span class="meta-value"><?php echo e($invoiceDate); ?></span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Payment Month</span>
                    <span class="meta-value"><?php echo e($payment->payment_month); ?></span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Status</span>
                    <span class="status-badge status-<?php echo e($payment->status); ?>">
                        <?php echo e($payment->status); ?>

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
                        <p class="name"><?php echo e($club->name ?? 'Taekwondo Club'); ?></p>
                        <?php if($club->street): ?>
                            <p><?php echo e($club->street); ?></p>
                        <?php endif; ?>
                        <?php if($club->city && $club->country): ?>
                            <p><?php echo e($club->city); ?>, <?php echo e($club->country); ?></p>
                        <?php endif; ?>
                        <?php if($club->phone): ?>
                            <p><?php echo e($club->phone); ?></p>
                        <?php endif; ?>
                        <?php if($club->email): ?>
                            <p><?php echo e($club->email); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="detail-box">
                    <h3>Bill To</h3>
                    <div class="detail-content">
                        <p class="name"><?php echo e($student->name); ?> <?php echo e($student->surname); ?></p>
                        <p>Student ID: <?php echo e($student->uid); ?></p>
                        <?php if($student->email): ?>
                            <p><?php echo e($student->email); ?></p>
                        <?php endif; ?>
                        <?php if($student->phone): ?>
                            <p><?php echo e($student->phone); ?></p>
                        <?php endif; ?>
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
                        <?php if(count($items) > 0): ?>
                            <?php $__currentLoopData = $items; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <tr>
                                    <td><?php echo e($item->description ?? 'Payment'); ?></td>
                                    <td><?php echo e($payment->method ?? 'N/A'); ?></td>
                                    <td><?php echo e($currencySymbol); ?> <?php echo e($itemAmount); ?></td>
                                </tr>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        <?php else: ?>
                            <tr>
                                <td>Monthly Payment</td>
                                <td><?php echo e($payment->method ?? 'N/A'); ?></td>
                                <td><?php echo e($currencySymbol); ?> <?php echo e($totalAmount); ?></td>
                            </tr>
                        <?php endif; ?>
                        <tr>
                            <td colspan="2">Total Amount (<?php echo e($currency->code); ?>)</td>
                            <td><?php echo e($currencySymbol); ?> <?php echo e($totalAmount); ?></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bank Information -->
            <?php if(count($bankInfo) > 0): ?>
                <div class="bank-info">
                    <h3>Bank Information</h3>
                    <div class="bank-grid">
                        <?php $__currentLoopData = $bankInfo; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $bank): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="bank-card">
                                <div class="bank-card-inner">
                                    <h4><?php echo e($bank['bank_name'] ?? 'N/A'); ?></h4>
                                    <p><span class="bank-label">Account Name:</span>
                                        <?php echo e($bank['account_name'] ?? 'N/A'); ?></p>
                                    <p><span class="bank-label">Account Number:</span>
                                        <?php echo e($bank['account_number'] ?? 'N/A'); ?></p>
                                    <?php if(isset($bank['iban'])): ?>
                                        <p><span class="bank-label">IBAN:</span> <?php echo e($bank['iban']); ?></p>
                                    <?php endif; ?>
                                    <?php if(isset($bank['swift_code'])): ?>
                                        <p><span class="bank-label">SWIFT Code:</span> <?php echo e($bank['swift_code']); ?></p>
                                    <?php endif; ?>
                                    <?php if(isset($bank['branch'])): ?>
                                        <p><span class="bank-label">Branch:</span> <?php echo e($bank['branch']); ?></p>
                                    <?php endif; ?>
                                    <?php if(isset($bank['currency'])): ?>
                                        <p><span class="bank-label">Currency:</span> <?php echo e($bank['currency']); ?></p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Notes -->
            <?php if($payment->notes): ?>
                <div class="notes">
                    <h4>Notes:</h4>
                    <p><?php echo e($payment->notes); ?></p>
                </div>
            <?php endif; ?>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h4>Thank You!</h4>
            <p>We appreciate your business and continued support.</p>
        </div>

        <!-- Print Info -->
        <div class="print-info">
            Generated on <?php echo e(now()->format('F d, Y')); ?>

        </div>
    </div>
</body>

</html>
<?php /**PATH C:\Users\Hasnat Khan\Desktop\companies\KB-Solution\taekwondo\web\resources\views/student/invoices/invoice.blade.php ENDPATH**/ ?>