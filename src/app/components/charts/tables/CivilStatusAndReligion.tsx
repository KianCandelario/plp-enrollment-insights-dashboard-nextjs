import { CivilStatus } from "@/app/components/charts/demographics/CivilStatus";
import { Table2Icon } from "lucide-react";
import { Religion } from "@/app/components/charts/demographics/Religion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function CivilStatusAndReligion() {
  return (
    <Tabs defaultValue="civil_status" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="civil_status">Civil Status</TabsTrigger>
        <TabsTrigger value="religion">Religion</TabsTrigger>
      </TabsList>
      <TabsContent className="h-full" value="civil_status">
        <Card className="flex flex-col h-[93%]">
          <CardHeader>
            <CardTitle>Civil Status</CardTitle>
            <CardDescription className="flex items-center">
                <Table2Icon className="h-4 w-4 mr-1" /> Breakdown of students' civil status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 justify-center">

            <CivilStatus />

          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent className="h-full" value="religion">
        <Card className="h-[93%]">
          <CardHeader>
            <CardTitle>Religion</CardTitle>
            <CardDescription className="flex items-center">
                <Table2Icon className="h-4 w-4 mr-1" /> Overview of the religious affiliations of enrollees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            <Religion />

          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
