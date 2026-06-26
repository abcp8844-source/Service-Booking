import React, { useState, useEffect } from 'react';
import { CATEGORIES, ServiceCategory } from '../data/categories';
import { Search, ChevronLeft, MapPin, User, Phone, CheckCircle2, AlertCircle, Star, Sparkles, Navigation, Map, Calendar, Briefcase, Globe, HelpCircle, Share2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { calculateDistance } from '../utils/distance';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';
import AIAssistantModal from './AIAssistantModal';

interface Provider {
  id: string;
  shopName: string;
  categoryId: string;
  location: { lat: number; lng: number };
  rating: number;
  ratingCount: number;
  distance?: number;
}

export default function Home() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [step, setStep] = useState<'categories' | 'location' | 'providers' | 'booking'>('categories');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const [locError, setLocError] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // سپورٹ اور شیئر فنکشنز
  const handleSupport = () => { window.location.href = "mailto:abcp8844@gmail.com?subject=Help"; };
  const handleShare = async () => { if (navigator.share) { await navigator.share({ title: 'App', url: window.location.href }); } else { alert('Link: ' + window.location.href); } };

  const translatedCategories = CATEGORIES.map(cat => ({ ...cat, translatedName: t(`cat_${cat.id}`, cat.name) }));
  const filteredCategories = translatedCategories.filter(cat => 
    cat.translatedName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategorySelect = (cat: typeof translatedCategories[0]) => { setSelectedCategory(cat); setStep('location'); setLocError(''); setCustomLocation(''); };

  const requestCurrentLocation = async () => {
    setLoadingProviders(true); setLocError('');
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      await fetchProviders({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch { setLoadingProviders(false); setLocError(t('failed_location')); }
  };

  const searchCustomLocation = async () => {
    if (!customLocation.trim()) return;
    setLoadingProviders(true); setLocError('');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(customLocation)}`);
      const data = await res.json();
      if (data && data.length > 0) await fetchProviders({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      else throw new Error("Location not found");
    } catch { setLoadingProviders(false); setLocError('Error.'); }
  };

  const fetchProviders = async (coords: {lat: number, lng: number}) => {
    if (!selectedCategory) return;
    try {
      const q = query(collection(db, 'providers'), where('categoryId', '==', selectedCategory.id));
      const snapshot = await getDocs(q);
      const found: Provider[] = [];
      snapshot.forEach(doc => {
        const p = { id: doc.id, ...doc.data() } as Provider;
        p.distance = calculateDistance(coords.lat, coords.lng, p.location.lat, p.location.lng);
        found.push(p);
      });
      found.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      setProviders(found.slice(0, 20));
      setStep('providers');
    } catch { setLocError('Error.'); } finally { setLoadingProviders(false); }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus('submitting');
    try {
      await addDoc(collection(db, 'bookings'), { providerId: selectedProvider?.id, customerName, customerPhone, appointmentTime, status: 'pending', createdAt: serverTimestamp() });
      setBookingStatus('success');
    } catch { setBookingStatus('idle'); setErrorMsg('Error'); }
  };

  const IconComponent = ({ name, className }: { name: string, className?: string }) => {
    const Icon = (Icons as any)[name] || Icons.HelpCircle;
    return <Icon className={className} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-extrabold">{t('app_title')}</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleSupport} className="text-sm font-bold text-gray-700">Help</button>
          <button onClick={handleShare} className="text-sm font-bold text-gray-700">Share</button>
          <LanguageSelector />
        </div>
      </header>

      {/* بقیہ تمام کوڈ ویسا ہی ہے جیسا آپ کی اصل فائل میں تھا */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        {step === 'categories' && ( /* ... آپ کا اصل Categories کوڈ ... */ )}
        {step === 'location' && ( /* ... آپ کا اصل Location کوڈ ... */ )}
        {/* باقی کوڈ ویسا ہی رکھیں */}
      </main>
      
      <AIAssistantModal isOpen={showAiModal} onClose={() => setShowAiModal(false)} onSelectCategory={handleCategorySelect} />
    </div>
  );
}
