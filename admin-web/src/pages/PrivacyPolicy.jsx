// src/pages/PrivacyPolicy.jsx
import React from 'react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-8xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 animate-fade-in">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-emerald-400 uppercase tracking-tight">🔒 Privacy Policy & Data Protection</h1>
        <p className="text-xs text-slate-500 mt-1">Last Updated: October 2026 | PSPL Compliance Center</p>
      </header>

      <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
        <p>
          పల్నాడు స్ట్రీట్ ప్రీమియర్ లీగ్ (<b className="text-emerald-400">PSPL</b>) తన ప్లేయర్స్ మరియు యూజర్ల వ్యక్తిగత డేటా భద్రతకు అత్యంత ప్రాధాన్యత ఇస్తుంది. మా టాలెంట్ పూల్ లోపల పారదర్శకతను కాపాడటానికి మరియు నకిలీ (Duplicate) రిజిస్ట్రేషన్లను అరికట్టడానికి మేము సేకరించే సమాచారం యొక్క పూర్తి చట్టపరమైన వివరాలు ఇక్కడ పొందుపరిచాము.
        </p>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">1. మేము ఏ సమాచారాన్ని సేకరిస్తాము?</h3>
          <p className="text-xs text-slate-400">
            ప్లేయర్ రిజిస్ట్రేషన్ సమయంలో మీ పేరు, మొబైల్ నెంబర్, నియోజకవర్గం, ప్రొఫైల్ ఫోటో మరియు మీ ప్రభుత్వ గుర్తింపు కార్డు (Aadhaar / Voter ID) నెంబర్‌ను సేకరించడం జరుగుతుంది.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">2. క్రిప్టోగ్రాఫిక్ ప్రొటెక్షన్ (Data Encryption)</h3>
          <p className="text-xs text-slate-400">
            భద్రతా ప్రమాణాల ప్రకారం, మీరు ఎంటర్ చేసే ఐడీ కార్డ్ నెంబర్ మీ బ్రౌజర్ లోపలే <b className="text-emerald-400">SHA-256 Cryptographic Hash</b> గా మార్చబడుతుంది. మీ అసలైన ఐడీ నెంబర్ మా సర్వర్లలో లేదా డేటాబేస్‌లలో ఎక్కడా స్టోర్ అవ్వదు. ఈ హ్యాష్ కోడ్ ద్వారా మీ ఒరిజినల్ నెంబర్‌ను ఎవరూ తిరిగి కనిపెట్టలేరు.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-base font-bold text-white">3. డేటా వినియోగం & అనుమతి (User Consent)</h3>
          <p className="text-xs text-slate-400">
            మీరు స్వచ్ఛందంగా అందించిన సమ్మతి (Consent Checkbox) ఆధారంగా మాత్రమే ఈ సమాచారం సేకరించబడుతుంది. ఈ డేటా కేవలం అడ్మిన్ వెరిఫికేషన్ మరియు డూప్లికేట్ స్క్రీనింగ్ కోసం మాత్రమే ఉపయోగించబడుతుంది. ఏ ఇతర థర్డ్-పార్టీ సంస్థలకు మీ డేటా విక్రయించబడదు లేదా బదిలీ చేయబడదు.
          </p>
        </section>
      </div>
    </div>
  );
};
