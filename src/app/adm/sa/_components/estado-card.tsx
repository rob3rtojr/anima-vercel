import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ProductCardProps {
  estadoName: string
  quantity: number
  dailyData: { createdAt: string; count: number }[]
}

export default function EstadoCard({ estadoName, quantity, dailyData }: ProductCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="font-bold text-lg">{estadoName}</h3>
        <Badge variant="outline" className="text-sm px-2 py-1">
          {quantity} {quantity === 1 ? 'questionário' : 'questionários'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="createdAt" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ fontSize: '12px' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}