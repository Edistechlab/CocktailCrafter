export default function Loading() {
    return (
        <div className="relative pb-32">
            <div className="pt-24 pb-8 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="w-32 h-5 bg-white/5 rounded-full mx-auto mb-6 animate-pulse"></div>
                    <div className="w-2/3 h-20 bg-white/5 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                </div>
            </div>
            <div className="px-6 md:px-12 max-w-7xl mx-auto">
                <div className="mb-12 space-y-6">
                    <div className="w-full max-w-2xl h-14 bg-white/5 rounded-2xl animate-pulse"></div>
                    <div className="flex gap-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-28 h-9 bg-white/5 rounded-lg animate-pulse"></div>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="bg-white/5 rounded-[32px] overflow-hidden animate-pulse">
                            <div className="h-[280px] bg-white/5"></div>
                            <div className="p-6 space-y-4">
                                <div className="h-4 bg-white/5 rounded w-3/4"></div>
                                <div className="h-4 bg-white/5 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
