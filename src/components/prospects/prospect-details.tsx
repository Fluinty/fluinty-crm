'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import { EventsLog } from '@/components/common/events-log'
import { RemindersList } from '@/components/common/reminders-list'

// Define type locally
type Prospect = {
    id: string
    name: string
    status: string
    implementation_cost: number
    maintenance_cost: number
    project_info: string
    created_at: string
}

export function ProspectDetails({
    prospect,
    onUpdate,
    onDelete
}: {
    prospect: Prospect
    onUpdate: (updated: Prospect) => void
    onDelete: (id: string) => void
}) {
    const [loading, setLoading] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleStatusChange = async (newStatus: string) => {
        const { data, error } = await supabase
            .from('prospects')
            .update({ status: newStatus })
            .eq('id', prospect.id)
            .select()
            .single()

        if (!error && data) {
            onUpdate(data)
            router.refresh()
        }
    }

    const handleConvert = async () => {
        if (!confirm('Czy na pewno chcesz przekonwertować tego prospekta na klienta?')) return

        const { error } = await supabase.rpc('convert_prospect_to_client', { prospect_uuid: prospect.id })

        if (error) {
            console.error('Błąd konwersji:', error)
            alert('Nie udało się przekonwertować prospekta')
        } else {
            onDelete(prospect.id) // Remove from list
            router.push('/clients') // Redirect to clients view
            router.refresh()
        }
    }

    const handleDelete = async () => {
        if (!confirm('Czy na pewno chcesz usunąć tego prospekta?')) return

        const { error } = await supabase.from('prospects').delete().eq('id', prospect.id)
        if (!error) {
            onDelete(prospect.id)
            router.refresh()
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{prospect.name}</h2>
                <Badge>{prospect.status}</Badge>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="flex gap-2 flex-wrap">
                    {['Nowy', 'Kontakt nawiązany', 'Wycena wysłana', 'Wygrany', 'Przegrany'].map((s) => (
                        <Button
                            key={s}
                            variant={prospect.status === s ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleStatusChange(s)}
                        >
                            {s}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Details Form (Read-only or Edit mode) - simplified for now */}
            <div className="grid gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-500">Informacje o projekcie</label>
                    <p>{prospect.project_info || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Wdrożenie</label>
                        <p>{prospect.implementation_cost} PLN</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Miesięcznie</label>
                        <p>{prospect.maintenance_cost} PLN</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <EventsLog prospectId={prospect.id} />
                <RemindersList prospectId={prospect.id} />
            </div>

            <div className="flex gap-2 pt-4 border-t">
                {prospect.status === 'Wygrany' && (
                    <Button onClick={handleConvert} className="bg-green-600 hover:bg-green-700">
                        Konwertuj na Klienta
                    </Button>
                )}
                <Button variant="destructive" onClick={handleDelete}>
                    Usuń
                </Button>
            </div>
        </div>
    )
}
