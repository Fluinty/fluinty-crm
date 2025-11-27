import { createClient } from '@/utils/supabase/server'
import { ProspectsTable } from '@/components/prospects/prospects-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ProspectForm } from '@/components/prospects/prospect-form'

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
                <Sheet>
                    <SheetTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Dodaj Prospekta
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <ProspectForm />
                    </SheetContent>
                </Sheet>
            </div>
            <ProspectsTable initialProspects={prospects || []} />
        </div>
    )
}
