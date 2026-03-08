"use client"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

interface ChartData {
    name: string
    users: number
}

export function UserGrowthChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) return null

    return (
        <div className="h-[220px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: -20,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00d2ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00d2ff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#888c94", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#888c94", fontSize: 12 }}
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
                        cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1, strokeDasharray: "3 3" }}
                    />
                    <Area
                        type="monotone"
                        dataKey="users"
                        name="New Users"
                        stroke="#00d2ff"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
