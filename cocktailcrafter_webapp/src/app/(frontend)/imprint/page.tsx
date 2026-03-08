export const metadata = {
    title: "Imprint – CocktailCrafter",
    description: "Legal imprint for CocktailCrafter by Edlinger Consulting & Media.",
}

export default function ImprintPage() {
    return (
        <div className="px-6 md:px-[5%] py-16 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-10"
                style={{ background: 'linear-gradient(to right, #ffffff, #a0a5b1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Imprint
            </h1>

            <p className="text-[#888c94] mb-6">Information according to Swiss law</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Responsible entity</h2>
            <p className="text-[#888c94] mb-6">
                Edlinger Consulting &amp; Media<br />
                Städtchenstrasse 93<br />
                7320 Sargans<br />
                Switzerland<br />
                <a href="mailto:info@edistechlab.com" className="text-[#00d2ff] hover:underline">info@edistechlab.com</a>
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Authorized Representative</h2>
            <p className="text-[#888c94] mb-6">Thomas Edlinger</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Company Information</h2>
            <p className="text-[#888c94] mb-6">
                Company name: Edlinger Consulting &amp; Media<br />
                Registration number: CHE-493.800.326
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Disclaimer</h2>
            <p className="text-[#888c94] mb-4">The author assumes no liability for the correctness, accuracy, timeliness, reliability, or completeness of the information provided.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">Copyright Notice</h2>
            <p className="text-[#888c94] mb-4">The copyright and all other rights to content, images, photos, or other files on this website belong exclusively to Edlinger Consulting &amp; Media or the specifically named rights holders. Prior written consent from the copyright holder is required for the reproduction of any elements.</p>
        </div>
    )
}
