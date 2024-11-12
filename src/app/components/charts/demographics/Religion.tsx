import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReligionData {
  religion: string;
  population: string;
}

interface ReligionProps {
  selectedCollege: string;
}

export function Religion({ selectedCollege }: ReligionProps) {
  const [religionData, setReligionData] = useState<ReligionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/religion?college=${encodeURIComponent(selectedCollege)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch religion data');
        }
        const data = await response.json();
        setReligionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCollege]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="max-h-[450px] overflow-y-auto">
      <Table>
        <TableCaption>Highlights the diversity of beliefs within the student population.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[90%]">Religion</TableHead>
            <TableHead>Population</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {religionData.map((religion) => (
            <TableRow key={religion.religion}>
              <TableCell className="font-medium">{religion.religion}</TableCell>
              <TableCell>{religion.population}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}