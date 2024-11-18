// app/components/charts/demographics/CivilStatus.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CivilStatusProps {
  selectedCollege: string;
}

interface CivilStatusData {
  civil_status: string;
  population: number;
}

const CivilStatus: React.FC<CivilStatusProps> = ({ selectedCollege }) => {
  const [civilStatusData, setCivilStatusData] = React.useState<CivilStatusData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchCivilStatusData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/civil-status?college=${encodeURIComponent(selectedCollege)}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CivilStatusData[] = await response.json();
        setCivilStatusData(data);
      } catch (err) {
        console.error('Error fetching civil status data:', err);
        setError('Failed to load civil status data');
      } finally {
        setLoading(false);
      }
    };

    fetchCivilStatusData();
  }, [selectedCollege]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Table>
      <TableCaption>
        Provides insights into the proportion of single, married,
        and other categories among enrollees.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Civil Status</TableHead>
          <TableHead className="text-right">Population</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center">
              Loading...
            </TableCell>
          </TableRow>
        ) : civilStatusData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        ) : (
          civilStatusData.map((status) => (
            <TableRow key={status.civil_status}>
              <TableCell className="font-medium">{status.civil_status}</TableCell>
              <TableCell className="text-right">{status.population}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CivilStatus;