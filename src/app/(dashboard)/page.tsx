import { createClient } from '@/utils/supabase/server'
import { ProspectsTable } from '@/components/prospects/prospects-table'
import { AddProspectSheet } from '@/components/prospects/add-prospect-sheet'

export default async function ProspectsPage() {
    const supabase = await createClient()
    const { data: prospects } = await supabase
        .from('prospects')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Prospekci</h1>
                <AddProspectSheet />
            </div>
            <ProspectsTable initialProspects={prospects || []} />
        </div>
    )
}
