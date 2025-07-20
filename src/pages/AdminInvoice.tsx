import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  FileText
} from "lucide-react";

const AdminInvoice = () => {
  const { orderId } = useParams();

  const [invoice, setInvoice] = useState<any>(null);
  const [businessInfo, setBusinessInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessRef = doc(db, "businessInfo", "main");
        const businessSnap = await getDoc(businessRef);
        if (businessSnap.exists()) {
          setBusinessInfo(businessSnap.data());
        }

        const orderRef = doc(db, "orders", orderId || "");
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          setInvoice(orderSnap.data());
        } else {
          console.log("Order not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [orderId]);

  if (!invoice || !businessInfo) return <p className="p-4">Loading...</p>;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In real app, this would generate PDF
    console.log("Downloading invoice...");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/orders">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <FileText className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Invoice #{invoice.invoiceNumber}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-8">
            {/* Business Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">{businessInfo.name}</h1>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{businessInfo.address}</p>
                  <p>Tel: {businessInfo.phone}</p>
                  <p>Email: {businessInfo.email}</p>
                  <p>Tax No: {businessInfo.taxNumber}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
                  <p><span className="font-medium">Order #:</span> {invoice.id}</p>
                  <p><span className="font-medium">Date:</span> {invoice.orderDate}</p>
                  <p><span className="font-medium">Due Date:</span> {invoice.dueDate}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Customer Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium">{invoice.customer.name}</h4>
                <p className="text-sm text-muted-foreground">{invoice.customer.address}</p>
                <p className="text-sm text-muted-foreground">Tel: {invoice.customer.phone}</p>
                <p className="text-sm text-muted-foreground">Email: {invoice.customer.email}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Items:</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-4">Description</th>
                      <th className="text-center p-4">Quantity</th>
                      <th className="text-right p-4">Unit Price</th>
                      <th className="text-right p-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-4">{item.name}</td>
                        <td className="text-center p-4">{item.quantity}</td>
                        <td className="text-right p-4">R{item.price}</td>
                        <td className="text-right p-4">R{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>R{invoice.subtotal}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>R{invoice.total}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Payment Information:</h3>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p><span className="font-medium">Payment Method:</span> {invoice.paymentMethod}</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <Badge variant={invoice.paymentStatus === "Paid" ? "default" : "secondary"} className="ml-2">
                        {invoice.paymentStatus}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              <p>Thank you for your business!</p>
              <p>For any questions about this invoice, please contact us at {businessInfo.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInvoice;