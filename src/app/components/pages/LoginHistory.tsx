"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import db from '@/app/utilities/firebase/firestore';
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface LoginHistoryEntry {
  id: string;
  userName: string;
  success: boolean;
  timestamp: number;
  reason: string;
}

const LoginAttemptHistory = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      const loginHistoryRef = collection(db, 'loginHistory');
      const q = query(loginHistoryRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);

      const history: LoginHistoryEntry[] = [];
      snapshot.forEach((doc) => {
        history.push({
          id: doc.id,
          userName: doc.data().userName,
          success: doc.data().success,
          timestamp: doc.data().timestamp,
          reason: doc.data().reason,
        });
      });

      setLoginHistory(history);
    };

    fetchLoginHistory();
  }, []);

  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add title to the document
    doc.setFontSize(18);
    doc.text('Login History', 14, 22);

    // Prepare table data
    const tableData = loginHistory.map((entry) => [
      entry.userName,
      entry.success ? 'Success' : 'Failed',
      entry.reason,
      new Date(entry.timestamp).toLocaleString()
    ]);

    // Use autoTable plugin to create the table
    (doc as any).autoTable({
      startY: 30,
      head: [['Username', 'Status', 'Details', 'Timestamp']],
      body: tableData,
      theme: 'striped',
      styles: {
        cellPadding: 4,
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 60 },
        3: { cellWidth: 60 }
      }
    });

    // Save the PDF
    doc.save('login_history.pdf');
  };

  return (
    <Card className="h-[600px] w-[1000px]">
      <CardHeader className='h-[20%]'>
        <CardTitle className="text-2xl flex justify-between items-center">
          Login History
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={exportToPDF}
              className="rounded flex items-center"
              size="sm"
            >
              <Download className="mr-2 h-3 w-3" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="rounded flex items-center"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Back
            </Button>  
          </div>
        </CardTitle>
        <CardDescription>Monitor user access history with timestamps and details.</CardDescription>
      </CardHeader>
      <CardContent className='h-[80%] flex justify-center items-center'>
        <div className="h-full overflow-auto w-full">
          <Table className='w-full'>
            <TableHeader className='sticky top-0 bg-white z-10'>
              <TableRow>
                <TableHead className="w-1/4 font-bold">Username</TableHead>
                <TableHead className="w-1/4 font-bold">Status</TableHead>
                <TableHead className="w-1/4 font-bold">Details</TableHead>
                <TableHead className="w-1/4 font-bold">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.userName}</TableCell>
                  <TableCell
                    className={entry.success ? 'text-green-600' : 'text-red-600'}
                  >
                    {entry.success ? 'Success' : 'Failed'}
                  </TableCell>
                  <TableCell>{entry.reason}</TableCell>
                  <TableCell>{new Date(entry.timestamp).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginAttemptHistory;