import { createClient } from '@/utils/supabase/server'
import { ClientsTable } from '@/components/clients/clients-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default async function ClientsPage() {
    const supabase = await createClient()
    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Klienci</h1>
                <Button variant="outline" disabled>
                    <Plus className="mr-2 h-4 w-4" /> Dodaj Klienta (Ręcznie)
                </Button>
            </div>
            <ClientsTable initialClients={clients || []} />
        </div>
    )
}
