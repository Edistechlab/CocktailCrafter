export default function Loading() {
    return (
        <div className="relative pb-32 pt-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="w-32 h-5 bg-white/5 rounded-full mx-auto mb-6 animate-pulse"></div>
            <div className="w-1/2 h-20 bg-white/5 rounded-2xl mx-auto mb-16 animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white/5 rounded-3xl h-64 animate-pulse"></div>
                ))}
            </div>
        </div>
    )
}
