"use client"

import { useState, useMemo } from "react"
import { GlassIcon } from "@/components/GlassIcon"
import { IceIcon } from "@/components/IceIcon"
import AddBottleClient from "./AddBottleClient"
import AddTechniqueClient from "./AddTechniqueClient"
import EditTechniqueClient from "./EditTechniqueClient"
import AddGarnishClient from "./AddGarnishClient"
import EditGarnishClient from "./EditGarnishClient"
import AddIceClient from "./AddIceClient"
import EditIceClient from "./EditIceClient"
import AddGlassClient from "./AddGlassClient"
import EditGlassClient from "./EditGlassClient"

export default function CatalogsManager({
    initialGlasses,
    initialIces,
    initialTechniques,
    initialGarnishes
}: {
    initialGlasses: any[],
    initialIces: any[],
    initialTechniques: any[],
    initialGarnishes: any[]
}) {
    return (
        <div className="space-y-16">
            <header className="mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase italic text-[#00d2ff]">Equipment & Gear</h1>
                    <p className="text-[#888c94] text-xs font-black uppercase tracking-widest">Standardize your hardware and technical procedures.</p>
                </div>
            </header>

            {/* Techniques Section */}
            <section>
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center">
                            <i className="ph-fill ph-waves text-[#00d2ff] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-bold uppercase italic tracking-tight">Techniques ({initialTechniques.length})</h2>
                    </div>
                    <AddTechniqueClient />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialTechniques.map(t => (
                        <EditTechniqueClient key={t.id} technique={t} />
                    ))}
                </div>
            </section>

            {/* Glasses Section */}
            <section>
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center">
                            <i className="ph-fill ph-brandy text-[#00d2ff] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-bold uppercase italic tracking-tight">Glassware ({initialGlasses.length})</h2>
                    </div>
                    <AddGlassClient />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {initialGlasses.map(g => (
                        <EditGlassClient key={g.id} glass={g} />
                    ))}
                </div>
            </section>

            {/* Ice Section */}
            <section>
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center">
                            <i className="ph-fill ph-snowflake text-[#00d2ff] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-bold uppercase italic tracking-tight">Ice Program ({initialIces.length})</h2>
                    </div>
                    <AddIceClient />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {initialIces.map(i => (
                        <EditIceClient key={i.id} ice={i} />
                    ))}
                </div>
            </section>

            {/* Garnishes Section */}
            <section>
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00d2ff]/10 rounded-xl flex items-center justify-center">
                            <i className="ph-fill ph-leaf text-[#00d2ff] text-xl"></i>
                        </div>
                        <h2 className="text-xl font-bold uppercase italic tracking-tight">Garnishes ({initialGarnishes.length})</h2>
                    </div>
                    <AddGarnishClient />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {initialGarnishes.map(g => (
                        <EditGarnishClient key={g.id} garnish={g} />
                    ))}
                </div>
            </section>
        </div>
    )
}
