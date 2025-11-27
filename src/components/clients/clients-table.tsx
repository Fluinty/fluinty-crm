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
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { ClientDetails } from './client-details'

type Client = {
    id: string
    name: string
    implementation_cost: number
    maintenance_cost: number
    project_info: string
    created_at: string
    converted_at: string
}

export function ClientsTable({ initialClients }: { initialClients: Client[] }) {
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [clients, setClients] = useState(initialClients)

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('pl-PL')
    }

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nazwa</TableHead>
                            <TableHead>Data konwersji</TableHead>
                            <TableHead className="text-right">Wdrożenie</TableHead>
                            <TableHead className="text-right">Miesięcznie</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    Brak klientów.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow
                                    key={client.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => setSelectedClient(client)}
                                >
                                    <TableCell className="font-medium">{client.name}</TableCell>
                                    <TableCell>{formatDate(client.converted_at)}</TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(client.implementation_cost)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(client.maintenance_cost)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Sheet open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    {selectedClient && (
                        <ClientDetails
                            client={selectedClient}
                            onDelete={(id) => {
                                setClients(clients.filter(c => c.id !== id))
                                setSelectedClient(null)
                            }}
                        />
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
