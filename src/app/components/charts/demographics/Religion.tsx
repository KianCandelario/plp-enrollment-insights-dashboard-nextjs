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

const stud_religion = [
  {
    religion: "Roman Catholic",
    population: "3223",
  },
  {
    religion: "Born-Again Christian",
    population: "450",
  },
  {
    religion: "Iglesia Ni Cristo",
    population: "161",
  },
  {
    religion: "Islam",
    population: "29",
  },
  {
    religion: "Jehovah's Witness",
    population: "17",
  },
  {
    religion: "Baptist",
    population: "12",
  },
  {
    religion: "Seventh-Day Adventist",
    population: "12",
  },
  {
    religion: "Members Church of God International",
    population: "10",
  },
  {
    religion: "Protestant/Pentecostal",
    population: "12",
  },
  {
    religion: "Methodist",
    population: "5",
  },
]

export function Religion() {
  return (
    <Table>
      <TableCaption>Highlights the diversity of beliefs within the student population.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[90%]">Civil Status</TableHead>
          <TableHead>Population</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stud_religion.map((religion) => (
          <TableRow key={religion.religion}>
            <TableCell className="font-medium">{religion.religion}</TableCell>
            <TableCell>{religion.population}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
