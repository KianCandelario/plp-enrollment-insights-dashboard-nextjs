import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const stud_civil_status = [
  {
    civil_status: "Living with Partner",
    population: "15",
  },
  {
    civil_status: "Married",
    population: "54",
  },
  {
    civil_status: "Separated",
    population: "3",
  },
  {
    civil_status: "Single",
    population: "3869",
  },
  {
    civil_status: "Single Parent",
    population: "8",
  },
  {
    civil_status: "Widower",
    population: "3",
  },
]

export function CivilStatus() {
  return (
    <Table>
      <TableCaption>Provides insights into the proportion of single, married, <br /> and other categories among enrollees.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[90%]">Civil Status</TableHead>
          <TableHead>Population</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stud_civil_status.map((civil_status) => (
          <TableRow key={civil_status.civil_status} className="h-14">
            <TableCell className="font-medium">{civil_status.civil_status}</TableCell>
            <TableCell>{civil_status.population}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
