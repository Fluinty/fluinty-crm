'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ProspectDetails } from './prospect-details'

// Define type locally or in types file
type Prospect = {
    id: string
    name: string
    status: string
    implementation_cost: number
    maintenance_cost: number
    project_info: string
    created_at: string
}

export function ProspectsTable({ initialProspects }: { initialProspects: Prospect[] }) {
    const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
    const [prospects, setProspects] = useState(initialProspects)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Nowy': return 'default'
            case 'Kontakt nawiązany': return 'secondary'
            case 'Wycena wysłana': return 'warning'
            case 'Wygrany': return 'success'
            case 'Przegrany': return 'destructive'
            default: return 'outline'
        }
    }

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nazwa</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Wdrożenie</TableHead>
                            <TableHead className="text-right">Miesięcznie</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {prospects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    Brak prospektów.
                                </TableCell>
                            </TableRow>
                        ) : (
                            prospects.map((prospect) => (
                                <TableRow
                                    key={prospect.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => setSelectedProspect(prospect)}
                                >
                                    <TableCell className="font-medium">{prospect.name}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusColor(prospect.status) as any}>
                                            {prospect.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(prospect.implementation_cost)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(prospect.maintenance_cost)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={!!selectedProspect} onOpenChange={(open) => !open && setSelectedProspect(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedProspect && (
                        <ProspectDetails
                            prospect={selectedProspect}
                            onUpdate={(updated) => {
                                setProspects(prospects.map(p => p.id === updated.id ? updated : p))
                                setSelectedProspect(updated)
                            }}
                            onDelete={(id) => {
                                setProspects(prospects.filter(p => p.id !== id))
                                setSelectedProspect(null)
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
