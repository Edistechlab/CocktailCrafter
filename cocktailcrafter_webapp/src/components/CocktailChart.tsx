"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts"

interface ChartData {
    name: string
    count: number
}

export function CocktailChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) return null

    return (
        <div className="h-[220px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#888c94", fontSize: 11 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#888c94", fontSize: 11 }}
                        allowDecimals={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1a1b21",
                            borderColor: "rgba(255,255,255,0.1)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.5)"
                        }}
                        itemStyle={{ color: "#00d2ff", fontWeight: "bold" }}
                        labelStyle={{ color: "#888c94", marginBottom: "4px" }}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                    />
                    <Bar
                        dataKey="count"
                        name="Cocktails Added"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? "#00d2ff" : "#00d2ff44"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
