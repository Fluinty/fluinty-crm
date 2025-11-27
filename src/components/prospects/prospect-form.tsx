'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export function ProspectForm({ onSuccess }: { onSuccess?: () => void }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name') as string,
            status: 'Nowy',
            implementation_cost: Number(formData.get('implementation_cost')),
            maintenance_cost: Number(formData.get('maintenance_cost')),
            project_info: formData.get('project_info') as string,
        }

        const supabase = createClient()
        const { error } = await supabase.from('prospects').insert(data)

        setLoading(false)
        if (!error) {
            router.refresh()
            if (onSuccess) onSuccess()
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nazwa firmy</label>
                <Input name="name" required placeholder="Nazwa firmy" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Informacje o projekcie</label>
                <Input name="project_info" placeholder="Opis projektu" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Koszt wdrożenia (PLN)</label>
                    <Input name="implementation_cost" type="number" defaultValue={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Miesięczne utrzymanie (PLN)</label>
                    <Input name="maintenance_cost" type="number" defaultValue={0} />
                </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Dodawanie...' : 'Dodaj Prospekta'}
            </Button>
        </form>
    )
}
