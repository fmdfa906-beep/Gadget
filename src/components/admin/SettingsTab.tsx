import React, { useState } from 'react';
import { 
  Save, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  HelpCircle,
  Copy,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { 
  isFirebaseConfigured, 
  getActiveFirebaseConfig, 
  saveFirebaseConfig, 
  resetFirebaseConfig 
} from '../../services/firebase';

export const SettingsTab: React.FC = () => {
  const { settings, saveShopSettings, showToast } = useShop();

  const [shopName, setShopName] = useState(settings.shopName);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber);
  const [phoneContact, setPhoneContact] = useState(settings.phoneContact);
  const [insideDhakaDelivery, setInsideDhakaDelivery] = useState(settings.insideDhakaDelivery);
  const [outsideDhakaDelivery, setOutsideDhakaDelivery] = useState(settings.outsideDhakaDelivery);
  const [shopDescription, setShopDescription] = useState(settings.shopDescription);
  const [address, setAddress] = useState(settings.address);
  const [announcement, setAnnouncement] = useState(settings.announcement);

  // Firebase Config Editor
  const currentConfig = getActiveFirebaseConfig();
  const [configJson, setConfigJson] = useState(
    currentConfig ? JSON.stringify(currentConfig, null, 2) : ''
  );
  const [isFirebaseSaving, setIsFirebaseSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveShopSettings({
      shopName: shopName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      phoneContact: phoneContact.trim(),
      insideDhakaDelivery: Number(insideDhakaDelivery),
      outsideDhakaDelivery: Number(outsideDhakaDelivery),
      shopDescription: shopDescription.trim(),
      address: address.trim(),
      announcement: announcement.trim()
    });
  };

  const handleSaveFirebase = () => {
    if (!configJson.trim()) {
      showToast('Firebase কনফিগারেশন JSON পেস্ট করুন', 'error');
      return;
    }
    setIsFirebaseSaving(true);
    const result = saveFirebaseConfig(configJson);
    setIsFirebaseSaving(false);
    if (result.success) {
      showToast('ফায়ারবেস কনফিগারেশন সফলভাবে যুক্ত ও রিলোড হয়েছে!');
    } else {
      showToast(result.error || 'কনফিগারেশন সেভ করতে ব্যর্থ হয়েছে', 'error');
    }
  };

  const handleResetFirebase = () => {
    if (window.confirm('আপনি কি ফায়ারবেস কনফিগারেশন রিসেট করতে চান?')) {
      resetFirebaseConfig();
    }
  };

  const isConfigured = isFirebaseConfigured();

  const sampleConfigSnippet = `{
  "apiKey": "AIzaSy...",
  "authDomain": "gadget-garden-xxxx.firebaseapp.com",
  "projectId": "gadget-garden-xxxx",
  "storageBucket": "gadget-garden-xxxx.appspot.com",
  "messagingSenderId": "1234567890",
  "appId": "1:1234567890:web:abcdef"
}`;

  return (
    <div className="space-y-8">
      {/* General Shop Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">শপ সেটিংস ও যোগাযোগের তথ্য</h3>
            <p className="text-xs text-slate-500">শপের নাম, হোয়াটসঅ্যাপ নম্বর ও ডেলিভারি চার্জ নির্ধারণ করুন</p>
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              শপের নাম (Shop Name)
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হোয়াটসঅ্যাপ অর্ডার নম্বর (WhatsApp Number)
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono font-bold text-emerald-700"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              অর্ডার কনফার্ম করার সময় গ্রাহকদের এই নম্বরে রিডাইরেক্ট করা হবে
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              হটলাইন ফোন নম্বর
            </label>
            <input
              type="text"
              required
              value={phoneContact}
              onChange={(e) => setPhoneContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              শপের ঠিকানা
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ঢাকা সিটির ডেলিভারি চার্জ (৳)
            </label>
            <input
              type="number"
              required
              min={0}
              value={insideDhakaDelivery}
              onChange={(e) => setInsideDhakaDelivery(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ঢাকার বাইরের ডেলিভারি চার্জ (৳)
            </label>
            <input
              type="number"
              required
              min={0}
              value={outsideDhakaDelivery}
              onChange={(e) => setOutsideDhakaDelivery(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-bold text-cyan-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            শীর্ষ অ্যানাউন্সমেন্ট ব্যানার লেখা (Announcement Bar)
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            শপ ডেসক্রিপশন (Shop Description)
          </label>
          <textarea
            rows={2}
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </form>

      {/* Firebase Database & Cloud Storage Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-extrabold text-slate-900">ফায়ারবেস ক্লাউড ডাটাবেস সংযোগ (Firebase Connection)</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ক্লাউড Firestore এবং Authentication দিয়ে পণ্য ও অর্ডার সিঙ্ক রাখুন
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ক্লাউড ফায়ারবেস সক্রিয়</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>পারসিস্টেন্ট লোকাল মোডে চলছে</span>
              </span>
            )}
          </div>
        </div>

        {/* Guidance Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>কীভাবে Firebase সংযোগ করবেন?</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
            <li>Firebase Console (<code>console.firebase.google.com</code>) এ গিয়ে একটি প্রোজেক্ট খুলুন।</li>
            <li><strong>Firestore Database</strong> তৈরি করে টেস্ট মোড বা <code>firestore.rules</code> রুলস সেট করুন।</li>
            <li>Project Settings &gt; General &gt; "Your apps" &gt; <strong>Web App (&lt;/&gt;)</strong> তৈরি করুন।</li>
            <li>সেখান থেকে <code>firebaseConfig</code> অবজেক্টটি কপি করে নিচের বক্সে পেস্ট করে <strong>"ফায়ারবেস কানেক্ট করুন"</strong> বাটনে ক্লিক করুন।</li>
          </ol>
        </div>

        {/* Config JSON textarea */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            আপনার Firebase Web App কনফিগারেশন JSON পেস্ট করুন:
          </label>
          <textarea
            rows={8}
            placeholder={sampleConfigSnippet}
            value={configJson}
            onChange={(e) => setConfigJson(e.target.value)}
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            টিপস: আপনি ফাইল হিসেবেও <code>/src/firebase-applet-config.json</code> ফাইলে সরাসরি পেস্ট করতে পারেন।
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetFirebase}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>রিসেট / সংযোগ বিচ্ছিন্ন</span>
          </button>

          <button
            type="button"
            onClick={handleSaveFirebase}
            disabled={isFirebaseSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Database className="w-4 h-4" />
            <span>ফায়ারবেস কানেক্ট করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
