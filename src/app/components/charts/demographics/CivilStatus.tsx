// app/components/charts/demographics/CivilStatus.tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CivilStatusProps {
  selectedCollege: string;
}

interface CivilStatusData {
  civil_status: string;
  population: string | number;
}

const CivilStatus: React.FC<CivilStatusProps> = ({ selectedCollege }) => {
  const [civilStatusData, setCivilStatusData] = useState<CivilStatusData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCivilStatusData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/civil-status?college=${encodeURIComponent(selectedCollege)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: CivilStatusData[] = await response.json();
        console.log('Fetched data:', data); // For debugging
        setCivilStatusData(data);
      } catch (error) {
        console.error('Error fetching civil status data:', error);
        setError('Failed to load civil status data');
      } finally {
        setLoading(false);
      }
    };

    fetchCivilStatusData();
  }, [selectedCollege]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <Table>
      <TableCaption>
        Provides insights into the proportion of single, married, <br /> 
        and other categories among enrollees.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[90%]">Civil Status</TableHead>
          <TableHead>Population</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center">Loading...</TableCell>
          </TableRow>
        ) : civilStatusData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center">No data available</TableCell>
          </TableRow>
        ) : (
          civilStatusData.map((status) => (
            <TableRow key={status.civil_status} className="h-14">
              <TableCell className="font-medium">{status.civil_status}</TableCell>
              <TableCell>{status.population}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CivilStatus;