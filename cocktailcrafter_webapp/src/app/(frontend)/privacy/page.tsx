export const metadata = {
    title: "Privacy Policy – CocktailCrafter",
    description: "Privacy policy for CocktailCrafter by Edlinger Consulting & Media.",
}

export default function PrivacyPage() {
    return (
        <div className="px-6 md:px-[5%] py-16 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-10"
                style={{ background: 'linear-gradient(to right, #ffffff, #a0a5b1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Privacy Policy
            </h1>

            <p className="text-[#888c94] mb-6">We place great importance on transparent handling of personal data. This privacy policy explains what personal data we collect, for what purpose, and to whom we disclose it.</p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">1. Which services we use</h2>
            <ul className="text-[#888c94] list-disc pl-5 mb-6 space-y-1">
                <li>Google Analytics</li><li>Google Fonts API</li><li>Google Ads</li>
                <li>Amazon Advertising & Associates</li><li>LinkedIn Ads</li>
                <li>Vimeo & YouTube</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">2. Contact information</h2>
            <p className="text-[#888c94] mb-4">If you have any questions regarding the protection of your data, you can contact us at any time:</p>
            <p className="text-[#888c94] mb-6">
                Edlinger Consulting &amp; Media<br />
                Städtchenstrasse 93, 7320 Sargans, Switzerland<br />
                <a href="mailto:info@edistechlab.com" className="text-[#00d2ff] hover:underline">info@edistechlab.com</a>
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">3. General Principles</h2>
            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">3.1 What data do we collect?</h3>
            <p className="text-[#888c94] mb-4">We primarily process personal data that you provide to us or that we collect when you use our website. This may include personal data, contact details, financial data, and online identifiers.</p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">3.2 Conditions of processing</h3>
            <p className="text-[#888c94] mb-4">We treat your data confidentially and in accordance with the purposes set out in this privacy policy. Legal justifications include your consent, performance of a contract, or our legitimate interests.</p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">3.3 How to withdraw consent</h3>
            <p className="text-[#888c94] mb-4">You can withdraw your consent at any time by sending an email to the address above. This does not affect data processing that has already taken place.</p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">3.4 Data retention</h3>
            <p className="text-[#888c94] mb-4">We only store personal data for as long as necessary. Website visit data is stored for twelve months. Contract data may be retained for up to 10 years as required by law.</p>

            <h3 className="text-lg font-semibold mt-6 mb-3 text-white">3.5 Your rights</h3>
            <ul className="text-[#888c94] list-disc pl-5 mb-6 space-y-1">
                <li>Right to information and rectification</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restriction of processing and to object</li>
                <li>Right to data portability and withdrawal</li>
                <li>Right to lodge a complaint with the <a href="https://www.edoeb.admin.ch" target="_blank" className="text-[#00d2ff] hover:underline">Federal Data Protection Commissioner</a></li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">4. Cookies</h2>
            <p className="text-[#888c94] mb-4">Our website uses cookies to ensure website functionality and analyze usage. Non-essential cookies will only be activated after your active consent. You can change your cookie settings at any time via your browser settings.</p>
        </div>
    )
}
