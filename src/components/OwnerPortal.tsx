import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, setDoc, getDoc, where } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase';
import { LogOut, CheckCircle2, Clock, XCircle, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface Booking {
  id: string;
  categoryId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  appointmentTime?: string;
  status: string;
  createdAt: any;
}

interface ProviderProfile {
  id: string;
  shopName: string;
  categoryId: string;
  location: { lat: number; lng: number };
  rating: number;
  ratingCount: number;
}

export default function OwnerPortal() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(auth.currentUser);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [shopName, setShopName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loc, setLoc] = useState<{lat: number; lng: number} | null>(null);
  const [locError, setLocError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (u) => {
      setUser(u);
      if (u) {
        try {
          // Fetch Provider Profile
          const profileRef = doc(db, 'providers', u.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            setProfile({ id: profileSnap.id, ...profileSnap.data() } as ProviderProfile);
            
            // Load bookings for this provider
            const q = query(collection(db, 'bookings'), where('providerId', '==', u.uid), orderBy('createdAt', 'desc'));
            const unsubscribeDb = onSnapshot(q, (snapshot) => {
              const bs: Booking[] = [];
              snapshot.forEach(doc => bs.push({ id: doc.id, ...doc.data() } as Booking));
              setBookings(bs);
              setLoading(false);
            }, (err) => {
              console.error("Error fetching bookings:", err);
              setLoading(false);
            });
            return () => unsubscribeDb();
          } else {
            setLoading(false);
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setBookings([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message + '\n\nIf you deployed to Vercel, make sure to add your Vercel domain to Firebase Console -> Authentication -> Settings -> Authorized domains.');
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const captureLocation = () => {
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoc({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (err) => {
        setLocError(t('failed_location'));
      }
    );
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !shopName || !categoryId || !loc) return;
    setSavingProfile(true);
    try {
      const newProfile = {
        id: user.uid,
        shopName,
        categoryId,
        location: loc,
        rating: 5.0,
        ratingCount: 0
      };
      await setDoc(doc(db, 'providers', user.uid), newProfile);
      setProfile(newProfile as ProviderProfile);
      
      // Load bookings after profile is created
      const q = query(collection(db, 'bookings'), where('providerId', '==', user.uid), orderBy('createdAt', 'desc'));
      onSnapshot(q, (snapshot) => {
        const bs: Booking[] = [];
        snapshot.forEach(doc => bs.push({ id: doc.id, ...doc.data() } as Booking));
        setBookings(bs);
      });
      
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    }
    setSavingProfile(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center mx-auto my-auto">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('owner_portal', 'Business Login')}</h2>
          <p className="text-gray-500 mb-8">{t('setup_business', 'Sign in to list your services and manage incoming bookings.')}</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
          >
            {t('register_login', 'Sign in with Google')}
          </button>
          <div className="mt-6">
            <Link to="/" className="text-sm font-semibold text-gray-400 hover:text-gray-900">
              {t('back')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('setup_business')}</h2>
          <p className="text-gray-500 mb-6 text-sm">{t('enter_shop_details')}</p>
          <form onSubmit={saveProfile} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">{t('business_name')}</label>
              <input 
                type="text" 
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
                placeholder="e.g. City Services"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">{t('primary_service')}</label>
              <select 
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 px-4 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
              >
                <option value="" disabled>{t('select_service')}</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{t(`cat_${cat.id}`, cat.name)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">{t('business_location')}</label>
              {loc ? (
                <div className="bg-green-50 text-green-700 px-4 py-3.5 rounded-xl flex items-center gap-2 font-medium border border-green-100">
                  <CheckCircle2 className="w-5 h-5" />
                  Location captured successfully
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={captureLocation}
                  className="w-full bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 font-semibold transition-all shadow-sm"
                >
                  <MapPin className="w-5 h-5" />
                  {t('capture_location')}
                </button>
              )}
              {locError && <p className="text-red-500 text-sm mt-2 font-medium">{locError}</p>}
            </div>
            <button 
              type="submit" 
              disabled={savingProfile || !loc}
              className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold hover:bg-blue-700 transition-all disabled:opacity-50 mt-2 shadow-lg shadow-blue-200"
            >
              {savingProfile ? 'Saving...' : t('complete_setup')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">{profile.shopName}</h1>
            <p className="text-xs font-medium text-gray-500">Business Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 hidden sm:block transition-colors">
            {t('back')}
          </Link>
          <button 
            onClick={handleLogout}
            className="text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 bg-red-50 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="mb-6 md:mb-8 mt-4">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{t('owner_dashboard')}</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your appointments and customer requests.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('no_bookings')}</h3>
            <p className="text-gray-500 font-medium">When customers nearby book your service, they will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{booking.customerName}</h3>
                    <p className="text-gray-500 text-sm font-medium mt-1 flex items-center gap-1.5">
                      {booking.customerPhone}
                    </p>
                    {booking.appointmentTime && (
                      <p className="text-blue-600 text-sm font-bold mt-1.5 bg-blue-50 w-fit px-2 py-1 rounded-md border border-blue-100">
                        Appointment: {new Date(booking.appointmentTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    )}
                  </div>
                  {booking.status === 'pending' && <Clock className="w-6 h-6 text-amber-500" />}
                  {booking.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {booking.status === 'cancelled' && <XCircle className="w-6 h-6 text-red-500" />}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(booking.id, 'completed')}
                        className="flex-1 bg-gray-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-gray-800 transition-colors"
                      >
                        {t('complete')}
                      </button>
                      <button 
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="flex-1 bg-red-50 text-red-600 rounded-xl py-3 text-sm font-bold hover:bg-red-100 transition-colors"
                      >
                        {t('decline')}
                      </button>
                    </>
                  )}
                  {booking.status !== 'pending' && (
                    <span className={`text-sm font-bold capitalize w-full text-center py-3 rounded-xl ${booking.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {t(booking.status)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
