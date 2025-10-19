"use client";

import { DollarSign, FileText, Calendar, Tag, User, Hash, AlertTriangle, Info } from 'lucide-react';

// Placeholder data representing the structure of the invoice in the screenshot
const invoiceData = {
    header: {
        invoiceNumber: "1067260",
        date: "Oct 05, 2025",
        amountUSD: "20.00", // Note: string in data, but using lineItems and summary for calculation
        customerID: "20a83294-6fbd-40f9-b123-3df5c37b1c29",
        status: "PAID",
    },
    supplier: {
        name: "ADYOUNEED",
        legalName: "ADYOUNEED SAS",
        address: "350, Chemin du Pré Neuf, 38330 Montbonnot Saint Martin, France",
        vatId: "FR 63 848265050",
    },
    billedTo: {
        name: "Acme Corp",
        address: "123 Main St, New York, NY 10001, USA",
        vatId: "N/A - US Customer",
    },
    subscription: {
        plan: "Starter-10DL",
        renewalDate: "Nov 05, 2025",
    },
    lineItems: [
        { description: "Starter-10DL Summer Campaign", amount: 20.00, vatRate: "0%", vatAmount: 0.00 },
        { description: "Starter-10DL Summer Campaign", amount: 20.00, vatRate: "0%", vatAmount: 0.00 },
        { description: "Starter-10DL Summer Campaign", amount: 20.00, vatRate: "0%", vatAmount: 0.00 },
        { description: "Starter-10DL Summer Campaign", amount: 20.00, vatRate: "0%", vatAmount: 0.00 },
        { description: "Starter-10DL Summer Campaign", amount: 20.00, vatRate: "0%", vatAmount: 0.00 },
    ],
    summary: {
        subtotal: 20.00,
        tax: 0.00,
        total: 20.00,
        payments: 20.00,
        amountDue: 0.00,
    },
    paymentDetails: {
        method: "Stripe Payment",
        transactionId: "pi_3Q2vSIAJk3dO90G503s4x2wL",
        date: "Oct 05, 2025",
    },
    vatExemptionNote: "This export transaction is exempt from VAT as per Article 146 of the EU VAT Directive.",
    notes: `AdCreative.ai, operated by ADYOUNEED SAS, is a leading digital solutions company based in the heart of Paris, France. Fully compliant with French legislation...`,
};

// --- Component Start ---

export default function InvoiceTemplateView() {

    // Helper to format numbers as currency
    const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

    // Removed handleDownloadPdf function and the import statements for html2canvas and jsPDF

    // The download button is kept but made non-functional to show where it would be
    const handleDownloadPdfPlaceholder = () => {
        alert("PDF Generation is disabled in this example after removing html2canvas and jsPDF.");
    };

    const StatusBadge = ({ status }) => {
        const base = "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold capitalize";
        switch (status) {
            case 'PAID':
                return <span className={`${base} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`}>
                    <DollarSign className="h-4 w-4 mr-1" />{status}
                </span>;
            case 'DUE':
                return <span className={`${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`}>
                    <AlertTriangle className="h-4 w-4 mr-1" />{status}
                </span>;
            default:
                return <span className={`${base} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100`}>{status}</span>;
        }
    };

    const InfoBlock = ({ icon: Icon, title, value }) => (
        <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-primary" />
            <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="relative flex min-h-screen w-full flex-col p-4 md:p-8 bg-gray-50 dark:bg-slate-900 font-sans">

            {/* Download Button (Non-functional placeholder) */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={handleDownloadPdfPlaceholder}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors cursor-not-allowed"
                    disabled
                >
                    <FileText className="h-5 w-5" />
                    Download PDF (Disabled)
                </button>
            </div>

            {/* Invoice Content */}
            <div id="invoice-template-content" className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-800 shadow-xl rounded-lg p-6 sm:p-10">

                {/* Header - Title and Invoice Details */}
                <header className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-200 dark:border-slate-700">

                    {/* Supplier/Logo Section (Left) */}
                    <div className="mb-6 sm:mb-0">
                        <h1 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                            {invoiceData.supplier.name}
                        </h1>
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">{invoiceData.supplier.legalName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{invoiceData.supplier.address}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">VAT ID: {invoiceData.supplier.vatId}</p>
                    </div>

                    {/* Invoice Meta Data (Right) */}
                    <div className="text-left sm:text-right space-y-2">
                        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">
                            INVOICE
                        </h2>
                        <InfoBlock icon={Hash} title="Invoice Number" value={invoiceData.header.invoiceNumber} />
                        <InfoBlock icon={Calendar} title="Invoice Date" value={invoiceData.header.date} />
                        <div className="sm:justify-end flex items-center space-x-3">
                             <Tag className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <div className='flex flex-col sm:items-end'>
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</p>
                                <StatusBadge status={invoiceData.header.status} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Billed To and Subscription Section */}
                <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Billed To details */}
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                            <User className="h-4 w-4 mr-2" /> Billed To
                        </h3>
                        <p className="text-base font-semibold text-slate-800 dark:text-white">{invoiceData.billedTo.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">{invoiceData.billedTo.address}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Customer ID: {invoiceData.header.customerID}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">VAT ID: {invoiceData.billedTo.vatId}</p>
                    </div>
                    {/* Subscription Details */}
                    <div className="p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2 flex items-center">
                            <Info className="h-4 w-4 mr-2" /> Subscription Details
                        </h3>
                        <p className="text-base font-semibold text-slate-800 dark:text-white">Plan: {invoiceData.subscription.plan}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Next Renewal: {invoiceData.subscription.renewalDate}</p>
                    </div>
                </section>

                {/* Line Items Table */}
                <section className="mt-8">
                    <div className="border-b-2 border-slate-300 dark:border-slate-600 pb-2 mb-2 flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                        <span>Description</span>
                        <span>Amount (USD)</span>
                    </div>

                    {/* Item Row */}
                    {invoiceData.lineItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-start py-2 text-sm text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                            <p className="max-w-[70%]">{item.description} <span className="text-xs text-slate-500 dark:text-slate-400">({item.vatRate} VAT)</span></p>
                            <p className="font-semibold">{formatCurrency(item.amount)}</p>
                        </div>
                    ))}
                    
                    {/* Summary Block */}
                    <div className="flex justify-end mt-4">
                        <div className="w-full sm:w-1/2 space-y-1 text-sm">
                            <div className="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                                <span>Subtotal</span>
                                <span>{formatCurrency(invoiceData.summary.subtotal)}</span>
                            </div>
                            <div className="flex justify-between py-1 text-slate-700 dark:text-slate-300">
                                <span>Tax (VAT)</span>
                                <span>{formatCurrency(invoiceData.summary.tax)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-b border-slate-200 dark:border-slate-700 font-bold text-base text-slate-800 dark:text-white">
                                <span>TOTAL</span>
                                <span>{formatCurrency(invoiceData.summary.total)}</span>
                            </div>
                            <div className="flex justify-between py-1 text-green-600 dark:text-green-400">
                                <span>Payments</span>
                                <span className='font-semibold'>- {formatCurrency(invoiceData.summary.payments)}</span>
                            </div>
                            <div className="flex justify-between pt-2 text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                <span>AMOUNT DUE</span>
                                <span>{formatCurrency(invoiceData.summary.amountDue)}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Payments and VAT Notes */}
                <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    
                    {/* Payment Confirmation */}
                    <div className="bg-green-50 dark:bg-green-900/50 p-4 rounded-lg flex items-start space-x-3 mb-4">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-base font-semibold text-green-800 dark:text-green-200">Payment Confirmed</p>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                {formatCurrency(invoiceData.summary.payments)} received on {invoiceData.paymentDetails.date} via {invoiceData.paymentDetails.method}. Transaction ID: {invoiceData.paymentDetails.transactionId}.
                            </p>
                        </div>
                    </div>
                    
                    {/* VAT Exemption */}
                    <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-base font-semibold text-blue-800 dark:text-blue-200">VAT Exemption</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{invoiceData.vatExemptionNote}</p>
                        </div>
                    </div>
                </section>

                {/* Footer Notes */}
                <section className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Notes</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{invoiceData.notes}</p>
                </section>

            </div>
        </div>
    );
}