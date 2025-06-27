"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/contexts/data-provider";
import { Download, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckBillStatusPage() {
  const { bills } = useData();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = (fileName: string) => {
    toast({
      title: "Download Started (Simulated)",
      description: `Downloading ${fileName}...`,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold md:text-3xl lg:text-4xl">Bill Status</h1>
        <p className="text-muted-foreground">
          Download your monthly mess bills here.
        </p>
      </div>
      
      {/* Desktop View: Table */}
      <div className="hidden rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.length > 0 ? (
              bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.month}</TableCell>
                  <TableCell>{bill.fileName}</TableCell>
                  <TableCell>{isClient ? new Date(bill.uploadDate).toLocaleDateString() : <Skeleton className="h-4 w-20" />}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(bill.fileName)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No bills uploaded yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View: Cards */}
      <div className="space-y-4 md:hidden">
        {bills.length > 0 ? (
          bills.map((bill) => (
            <Card key={bill.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{bill.month}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(bill.fileName)}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                  <FileText className="h-4 w-4" />
                  {bill.fileName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Uploaded on {isClient ? new Date(bill.uploadDate).toLocaleDateString() : <Skeleton className="inline-block h-4 w-20" />}</span>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No bills uploaded yet.
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}
