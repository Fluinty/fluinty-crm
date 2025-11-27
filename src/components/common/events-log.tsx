'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Event = {
    id: string
    description: string
    timestamp: string
}

export function EventsLog({
    prospectId,
    clientId
}: {
    prospectId?: string
    clientId?: string
}) {
    const [events, setEvents] = useState<Event[]>([])
    const [newEvent, setNewEvent] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const fetchEvents = async () => {
        let query = supabase.from('events').select('*').order('timestamp', { ascending: false })
        if (prospectId) query = query.eq('prospect_id', prospectId)
        if (clientId) query = query.eq('client_id', clientId)

        const { data } = await query
        if (data) setEvents(data)
    }

    useEffect(() => {
        fetchEvents()
    }, [prospectId, clientId])

    const handleAddEvent = async () => {
        if (!newEvent.trim()) return
        setLoading(true)

        const { error } = await supabase.from('events').insert({
            description: newEvent,
            prospect_id: prospectId,
            client_id: clientId,
        })

        if (!error) {
            setNewEvent('')
            fetchEvents()
        }
        setLoading(false)
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Dziennik zdarzeń</h3>
            <div className="flex gap-2">
                <Input
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder="Opisz zdarzenie..."
                />
                <Button onClick={handleAddEvent} disabled={loading}>Dodaj</Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {events.map((event) => (
                    <div key={event.id} className="text-sm border-l-2 border-gray-200 pl-2 py-1">
                        <p className="text-gray-500 text-xs">{new Date(event.timestamp).toLocaleString('pl-PL')}</p>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
