export const metadata = {
    title: "Terms and Conditions – CocktailCrafter",
    description: "General terms and conditions for CocktailCrafter by Edlinger Consulting & Media.",
}

export default function TermsPage() {
    return (
        <div className="px-6 md:px-[5%] py-16 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-10"
                style={{ background: 'linear-gradient(to right, #ffffff, #a0a5b1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                General Terms and Conditions
            </h1>
            <p className="text-[#888c94] mb-6">of Edlinger Consulting &amp; Media · As of September 2025</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§1 Scope and Definitions</h2>
            <p className="text-[#888c94] mb-4">The following General Terms and Conditions apply to all deliveries between us and a consumer in the version valid at the time of the order.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§2 Conclusion of Contract</h2>
            <p className="text-[#888c94] mb-4">The contracting party is Edlinger Consulting &amp; Media, Thomas Edlinger, Städtchenstrasse 93, CH-7320 Sargans, registered under number CHE-493.800.326.</p>
            <p className="text-[#888c94] mb-4">The presentation of goods in the shop does not constitute a legally binding offer. The contract is concluded when we confirm the order by automatically generated email.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§3 Prices &amp; Payment</h2>
            <p className="text-[#888c94] mb-4">Our company is not subject to VAT. Payment can be made by PayPal, credit card (Visa, Mastercard, Amex), and other options offered via zahls.ch.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§4 Delivery</h2>
            <p className="text-[#888c94] mb-4">All items are ready for immediate dispatch. Delivery is made within 5 working days of receipt of payment.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§6 Right of Withdrawal</h2>
            <p className="text-[#888c94] mb-4">Consumers have the right to withdraw from the contract within 14 days without giving any reason. To exercise this right, send a clear declaration to <a href="mailto:info@edistechlab.com" className="text-[#00d2ff] hover:underline">info@edistechlab.com</a>.</p>
            <p className="text-[#888c94] mb-4">In the event of cancellation, all payments will be refunded within 14 days. The consumer bears the return shipping costs.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§9 Digital Products</h2>
            <p className="text-[#888c94] mb-4">For digital products, the right of withdrawal expires upon commencement of the download or provision.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">§10 Contract Language</h2>
            <p className="text-[#888c94] mb-4">The contract language is German. Swiss law applies.</p>
        </div>
    )
}
