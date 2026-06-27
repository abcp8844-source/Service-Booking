import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Shield, FileText, PhoneCall, Mail, MapPin, Sparkles, Building2 } from 'lucide-react';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-6 py-10">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 px-4 py-2 rounded-full mb-4 shadow-sm animate-bounce">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('about', 'About Gemini Booking')}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {t('terms_privacy_support', 'Terms, Privacy & Support')}
          </h1>
          <p className="text-lg text-gray-500 font-medium mt-3 max-w-2xl mx-auto">
            {t('about_subtitle', 'We connect you with high-quality professionals in your area using smart location features.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('corporate_identity', 'Corporate Identity')}</h2>
            <div className="text-gray-600 text-sm leading-relaxed flex-1 font-medium">
              <p>{t('about_us_desc', 'We founded this platform with a vision to integrate technology with human convenience. We exist to simplify your access to skilled professionals, acting as a digital bridge that ensures quality and trust.')}</p>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('terms_service', 'Terms of Service')}</h2>
            <div className="text-gray-600 text-sm leading-relaxed flex-1 font-medium">
              <p>{t('terms_of_service_desc', 'Our platform functions as a digital directory and facilitator. While we are not directly responsible for personal actions, we maintain rigorous standards.')}</p>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('privacy_policy', 'Privacy Policy')}</h2>
            <div className="text-gray-600 text-sm leading-relaxed flex-1 font-medium">
              <p>{t('privacy_policy_desc', "Your trust is our most valuable asset. We utilize world-class security infrastructure to ensure your data remains protected.")}</p>
            </div>
          </motion.div>

          <motion.div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-6">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contact_support', 'Contact & Support')}</h2>
            <div className="text-gray-600 text-sm leading-relaxed flex-1 font-medium">
              <p>{t('contact_support_desc', 'We are dedicated to providing you with an exceptional experience. Our professional team is here to support you.')}</p>
            </div>
          </motion.div>
        </div>

        <motion.div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl shadow-xl mt-8 p-8 md:p-10">
          <h2 className="text-2xl font-extrabold mb-6">Admin & Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:abcp8844@gmail.com" className="bg-black text-white py-4 px-6 rounded-2xl font-bold text-center hover:bg-gray-700 transition-all border border-gray-600">
              Admin Contact (Email)
            </a>
            <a href="https://wa.me/message/H4KM5YQEOMITE1" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white py-4 px-6 rounded-2xl font-bold text-center hover:bg-blue-500 transition-all">
              Emergency Contact (WhatsApp)
            </a>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
