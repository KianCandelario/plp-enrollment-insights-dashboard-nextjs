"use client";

import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const DPAPolicy = () => {
    return ( 
        <Card className="w-full max-w-4xl mx-auto my-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold flex justify-between">
                    Data Privacy Act (DPA) Policy

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="rounded flex items-center"
                        size="sm"
                    >
                        <ArrowLeft className="mr-2 h-3 w-3" />
                        Back
                    </Button>
                </CardTitle>
                <CardDescription>
                Policy for PLP's Students' Ecological Profile Dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full max-h-[500px] overflow-y-auto">
                {/* 1. Introduction */}
                <AccordionItem value="introduction">
                    <AccordionTrigger>1. Introduction</AccordionTrigger>
                    <AccordionContent className='pl-3 text-sm'>
                    <p>
                        This Data Processing Agreement ("Agreement") outlines the terms 
                        regarding how PLP's Students' Ecological Profile Dashboard 
                        ("We," "Us," "Our") processes personal data provided by users 
                        ("You," "Your"). By using our platform, You consent to the 
                        practices outlined in this Agreement.
                    </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 2. Definitions */}
                <AccordionItem value="definitions">
                    <AccordionTrigger>2. Definitions</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                        <strong>Personal Data:</strong> Information uploaded to the 
                        system, such as students' ecological profiles, which may 
                        include names, identification numbers, environmental data, 
                        and other relevant details.
                        </li>
                        <li>
                        <strong>Processing:</strong> Operations such as uploading, 
                        storing, visualizing, exporting, or deleting data.
                        </li>
                        <li>
                        <strong>Controller:</strong> The entity (e.g., Your organization) 
                        deciding the purpose and means of processing the data.
                        </li>
                        <li>
                        <strong>Processor:</strong> The entity (Us) that processes 
                        Personal Data on behalf of the Controller.
                        </li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>

                {/* 3. Scope of Data Processing */}
                <AccordionItem value="scope">
                    <AccordionTrigger>3. Scope of Data Processing</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <p className="mb-3">
                        We process Personal Data strictly for:
                    </p>
                    <ol className="list-decimal pl-5 mb-3">
                        <li>Generating visualization reports from uploaded ecological profiles.</li>
                        <li>Providing administrative and staff functionalities.</li>
                    </ol>
                    <p>The system supports two types of users:</p>
                    <div className="mt-2 space-y-2">
                        <Badge variant="secondary" className='rounded'>Admin Users:</Badge> Capabilities include uploading data, resetting visualizations, managing user accounts, viewing login history, and exporting reports.

                        <br />

                         <Badge variant="outline" className='rounded'>Staff Users:</Badge> Capabilities are limited to exporting PDF reports.
                        
                    </div>
                    </AccordionContent>
                </AccordionItem>

                {/* 4. Data Retention */}
                <AccordionItem value="retention">
                    <AccordionTrigger>4. Data Retention</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <p>
                        We retain Personal Data for the duration specified by the Admin. 
                        Data can be deleted or reset by Admin Users. Upon request, we 
                        will delete all data as instructed by the Controller.
                    </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 5. User Responsibilities */}
                <AccordionItem value="user-responsibilities">
                    <AccordionTrigger>5. User Responsibilities</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <p>
                        As the Data Controller, You are responsible for:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>Ensuring that the uploaded data complies with applicable data protection laws.</li>
                        <li>Informing students or data subjects about the collection and processing of their data.</li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>

                {/* 6. Third-Party Data Sharing */}
                <AccordionItem value="third-party-data-sharing">
                    <AccordionTrigger>6. Third-Party Data Sharing</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <p>
                        We <b>do not share</b> Personal Data with third parties.
                    </p>
                    </AccordionContent>
                </AccordionItem>

                {/* 7. Data Security Measures */}
                <AccordionItem value="data-security-measures">
                    <AccordionTrigger>7. Data Security Measures</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <p>
                        We employ industry-standard safeguards, including:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li>Role-based access control (RBAC) to restrict Admin and Staff functionalities.</li>
                        <li>Exportable login history to track the real-time activity of Admin and Staff user.</li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>

                {/* 8. User Roles and Responsibilities */}
                <AccordionItem value="user-roles-and-responsibilities">
                    <AccordionTrigger>8. User Roles and Responsibilities</AccordionTrigger>
                    <AccordionContent className='pl-3'>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><Badge variant="secondary" className='rounded'>Admins:</Badge> Full control of data uploads, visualizations, account management, and history logs. Admins are responsible for ensuring data accuracy and compliance with this policy.</li>
                        <li><Badge variant="outline" className='rounded'>Staff Users:</Badge> Limited to viewing and exporting PDF reports. Staff members must ensure report confidentiality.</li>
                    </ul>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>
    );
}
 
export default DPAPolicy;