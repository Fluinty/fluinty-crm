'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { EventsLog } from '@/components/common/events-log'
import { RemindersList } from '@/components/common/reminders-list'

type Client = {
    id: string
    name: string
    implementation_cost: number
    maintenance_cost: number
    project_info: string
    created_at: string
    converted_at: string
}

export function ClientDetails({
    client,
    onDelete
}: {
    client: Client
    onDelete: (id: string) => void
}) {
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm('Czy na pewno chcesz usunąć tego klienta?')) return

        const { error } = await supabase.from('clients').delete().eq('id', client.id)
        if (!error) {
            onDelete(client.id)
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{client.name}</h2>
            </div>

            <div className="grid gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-500">Informacje o projekcie</label>
                    <p>{client.project_info || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Wdrożenie</label>
                        <p>{client.implementation_cost} PLN</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Miesięcznie</label>
                        <p>{client.maintenance_cost} PLN</p>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-500">Data konwersji</label>
                    <p>{new Date(client.converted_at).toLocaleString('pl-PL')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <EventsLog clientId={client.id} />
                <RemindersList clientId={client.id} />
            </div>

            <div className="flex gap-2 pt-4 border-t">
                <Button variant="destructive" onClick={handleDelete}>
                    Usuń Klienta
                </Button>
            </div>
        </div>
    )
}
