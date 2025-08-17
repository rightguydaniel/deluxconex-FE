import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiEdit2, FiChevronLeft, FiChevronRight, FiSave, FiX, FiMail, FiDownload } from 'react-icons/fi';
import AdminLayout from './AdminLayout';

enum InvoiceStatus {
  DRAFT = "draft",
  SENT = "sent",
  PAID = "paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled"
}

interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  notes?: string;
  terms?: string;
  createdAt?: string;
  updatedAt?: string;
  // These would come from joined tables in a real implementation
  order?: {
    id: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const ITEMS_PER_PAGE = 10;
const statusOptions = Object.values(InvoiceStatus);

const AdminInvoicesPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle status change
  const handleStatusChange = (invoiceId: string, newStatus: InvoiceStatus) => {
    setInvoices(invoices.map(invoice => 
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    ));
    // Here you would typically make an API call to update the invoice in the backend
  };

  // Start editing an invoice
  const startEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingInvoice(null);
  };

  // Save edited invoice
  const saveEditedInvoice = () => {
    if (!editingInvoice) return;
    
    setInvoices(invoices.map(invoice => 
      invoice.id === editingInvoice.id ? editingInvoice : invoice
    ));
    setEditingInvoice(null);
    // Here you would typically make an API call to update the invoice in the backend
  };

  // Handle field changes during editing
  const handleEditChange = (field: keyof Invoice, value: any) => {
    if (!editingInvoice) return;
    setEditingInvoice({ ...editingInvoice, [field]: value });

    // Recalculate total if relevant fields change
    if (['subtotal', 'tax', 'shipping', 'discount'].includes(field)) {
      const subtotal = field === 'subtotal' ? parseFloat(value) || 0 : editingInvoice.subtotal;
      const tax = field === 'tax' ? parseFloat(value) || 0 : editingInvoice.tax;
      const shipping = field === 'shipping' ? parseFloat(value) || 0 : editingInvoice.shipping;
      const discount = field === 'discount' ? parseFloat(value) || 0 : editingInvoice.discount || 0;
      
      const total = subtotal + tax + shipping - discount;
      setEditingInvoice({ ...editingInvoice, [field]: value, total });
    }
  };

  // Mock data loading - replace with actual API call
  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/api/invoices');
        // const data = await response.json();
        // setInvoices(data);
        
        // Mock data
        const mockInvoices: Invoice[] = [
          {
            id: 'inv-001',
            orderId: 'ord-001',
            userId: 'user-001',
            invoiceNumber: 'INV-2023-001',
            issueDate: '2023-05-01',
            dueDate: '2023-05-15',
            status: InvoiceStatus.PAID,
            subtotal: 2500,
            tax: 250,
            shipping: 150,
            discount: 100,
            total: 2800,
            notes: 'Thank you for your business!',
            terms: 'Payment due within 14 days',
            createdAt: '2023-05-01T10:30:00Z',
            updatedAt: '2023-05-01T10:30:00Z',
            order: {
              id: 'ord-001',
              items: [
                { name: '20ft Shipping Container', price: 2500, quantity: 1 }
              ]
            },
            user: {
              id: 'user-001',
              name: 'John Doe',
              email: 'john@example.com'
            }
          },
          {
            id: 'inv-002',
            orderId: 'ord-002',
            userId: 'user-002',
            invoiceNumber: 'INV-2023-002',
            issueDate: '2023-05-10',
            dueDate: '2023-05-24',
            status: InvoiceStatus.SENT,
            subtotal: 3800,
            tax: 380,
            shipping: 200,
            total: 4380,
            notes: 'Please make payment by the due date',
            terms: 'Payment due within 14 days',
            createdAt: '2023-05-10T14:15:00Z',
            updatedAt: '2023-05-10T14:15:00Z',
            order: {
              id: 'ord-002',
              items: [
                { name: '40ft Shipping Container', price: 3800, quantity: 1 }
              ]
            },
            user: {
              id: 'user-002',
              name: 'Jane Smith',
              email: 'jane@example.com'
            }
          },
          // Add more mock invoices as needed
        ];
        
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Generate PDF - placeholder function
  const generatePDF = (invoiceId: string) => {
    console.log(`Generating PDF for invoice ${invoiceId}`);
    // Implement actual PDF generation logic here
  };

  // Send invoice - placeholder function
  const sendInvoice = (invoiceId: string) => {
    console.log(`Sending invoice ${invoiceId} to customer`);
    // Implement actual email sending logic here
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by invoice number, status, order ID, or customer ID..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedInvoices.map((invoice) => (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{invoice.orderId.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.user?.name || `#${invoice.userId.substring(0, 8)}...`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.issueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(invoice.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <select
                            value={invoice.status}
                            onChange={(e) => handleStatusChange(invoice.id, e.target.value as InvoiceStatus)}
                            className={`px-2 py-1 rounded text-xs ${
                              invoice.status === InvoiceStatus.DRAFT ? 'bg-gray-100 text-gray-800' :
                              invoice.status === InvoiceStatus.SENT ? 'bg-blue-100 text-blue-800' :
                              invoice.status === InvoiceStatus.PAID ? 'bg-green-100 text-green-800' :
                              invoice.status === InvoiceStatus.OVERDUE ? 'bg-red-100 text-red-800' :
                              'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {statusOptions.map(option => (
                              <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => generatePDF(invoice.id)}
                              className="text-gray-600 hover:text-gray-900"
                              title="Download PDF"
                            >
                              <FiDownload />
                            </button>
                            <button
                              onClick={() => sendInvoice(invoice.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Send to Customer"
                            >
                              <FiMail />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredInvoices.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No invoices found
                </div>
              )}

              {totalPages > 1 && (
                <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)}</span> of{' '}
                        <span className="font-medium">{filteredInvoices.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          <FiChevronLeft className="h-5 w-5" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          <FiChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Invoice Edit Modal */}
      <AnimatePresence>
        {editingInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Edit Invoice {editingInvoice.invoiceNumber}
                  </h2>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                        <input
                          type="text"
                          value={editingInvoice.invoiceNumber}
                          onChange={(e) => handleEditChange('invoiceNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                          <input
                            type="date"
                            value={editingInvoice.issueDate}
                            onChange={(e) => handleEditChange('issueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                          <input
                            type="date"
                            value={editingInvoice.dueDate}
                            onChange={(e) => handleEditChange('dueDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editingInvoice.status}
                          onChange={(e) => handleEditChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtotal</label>
                        <input
                          type="number"
                          value={editingInvoice.subtotal}
                          onChange={(e) => handleEditChange('subtotal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                          <input
                            type="number"
                            value={editingInvoice.tax}
                            onChange={(e) => handleEditChange('tax', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
                          <input
                            type="number"
                            value={editingInvoice.shipping}
                            onChange={(e) => handleEditChange('shipping', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                          <input
                            type="number"
                            value={editingInvoice.discount || ''}
                            onChange={(e) => handleEditChange('discount', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md">
                          {formatCurrency(editingInvoice.total)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                    <textarea
                      value={editingInvoice.notes || ''}
                      onChange={(e) => handleEditChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add any notes for the customer..."
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
                    <textarea
                      value={editingInvoice.terms || ''}
                      onChange={(e) => handleEditChange('terms', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add payment terms and conditions..."
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEditedInvoice}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminInvoicesPage;