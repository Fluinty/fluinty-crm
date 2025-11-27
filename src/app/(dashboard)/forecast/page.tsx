import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ForecastPage() {
    const supabase = await createClient()

    const { data: clients } = await supabase.from('clients').select('maintenance_cost')
    const { data: prospects } = await supabase.from('prospects').select('status, maintenance_cost, implementation_cost')

    const confirmedRevenue = clients?.reduce((sum, client) => sum + (client.maintenance_cost || 0), 0) || 0

    const activeStatuses = ['Nowy', 'Kontakt nawiązany', 'Wycena wysłana']
    const activeProspects = prospects?.filter(p => activeStatuses.includes(p.status)) || []

    const potentialRevenue = activeProspects.reduce((sum, p) => sum + (p.maintenance_cost || 0), 0)
    const implementationRevenue = activeProspects.reduce((sum, p) => sum + (p.implementation_cost || 0), 0)

    const totalPotential = confirmedRevenue + potentialRevenue

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency',
            currency: 'PLN',
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Financial Forecast</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Miesięczny przychód stały
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(confirmedRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            Confirmed from active clients
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Potencjalny przychód miesięczny
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(potentialRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            From active prospects
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Łączny prognozowany przychód
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalPotential)}</div>
                        <p className="text-xs text-muted-foreground">
                            Confirmed + Potential
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Potencjalne przychody z wdrożeń
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(implementationRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            One-time implementation fees
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
