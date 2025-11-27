'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Circle } from 'lucide-react'

type Reminder = {
    id: string
    reminder_text: string
    reminder_date: string
    completed: boolean
}

export function RemindersList({
    prospectId,
    clientId
}: {
    prospectId?: string
    clientId?: string
}) {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [newReminder, setNewReminder] = useState('')
    const [newDate, setNewDate] = useState('')
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const fetchReminders = async () => {
        let query = supabase.from('reminders').select('*').order('reminder_date', { ascending: true })
        if (prospectId) query = query.eq('prospect_id', prospectId)
        if (clientId) query = query.eq('client_id', clientId)

        const { data } = await query
        if (data) setReminders(data)
    }

    useEffect(() => {
        fetchReminders()
    }, [prospectId, clientId])

    const handleAddReminder = async () => {
        if (!newReminder.trim() || !newDate) return
        setLoading(true)

        const { error } = await supabase.from('reminders').insert({
            reminder_text: newReminder,
            reminder_date: new Date(newDate).toISOString(),
            prospect_id: prospectId,
            client_id: clientId,
        })

        if (!error) {
            setNewReminder('')
            setNewDate('')
            fetchReminders()
        }
        setLoading(false)
    }

    const toggleComplete = async (id: string, current: boolean) => {
        await supabase.from('reminders').update({ completed: !current }).eq('id', id)
        fetchReminders()
    }

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Przypomnienia</h3>
            <div className="flex gap-2 flex-col sm:flex-row">
                <Input
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    placeholder="Przypomnij mi o..."
                />
                <Input
                    type="datetime-local"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full sm:w-auto"
                />
                <Button onClick={handleAddReminder} disabled={loading}>Dodaj</Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {reminders.map((reminder) => (
                    <div key={reminder.id} className={`flex items-center gap-2 p-2 rounded ${reminder.completed ? 'opacity-50' : ''}`}>
                        <button onClick={() => toggleComplete(reminder.id, reminder.completed)}>
                            {reminder.completed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5 text-gray-400" />}
                        </button>
                        <div className="flex-1">
                            <p className={`text-sm ${reminder.completed ? 'line-through' : ''}`}>{reminder.reminder_text}</p>
                            <p className={`text-xs ${new Date(reminder.reminder_date) < new Date() && !reminder.completed ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                                {new Date(reminder.reminder_date).toLocaleString('pl-PL')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
