import React from 'react';
import { Droplets, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types/store';
import { OptimizedImage } from '../components/OptimizedImage';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-14 text-slate-800 font-montserrat">
      
      {/* Hero Intro */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-[#B89025] font-semibold">
          {(settings.aboutBadge || settings.tagline || 'CRAFTED FOR DISTINCTION By Ashar Ul Haq Siddiqui').replace(/By AUHS/gi, 'By Ashar Ul Haq Siddiqui')}
        </span>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          {settings.aboutTitle || 'THE MUAVER STORY'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
          {settings.aboutSubtitle || 'Born out of an unwavering passion for master-grade perfumery and timeless quality.'}
        </p>
      </div>

      {/* Founder & CEO Spotlight Card */}
      <div className="bg-slate-50 p-6 sm:p-10 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
        <div className="w-14 h-14 rounded-full bg-[#0A1A4F] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
          AS
        </div>
        <div className="space-y-1.5 flex-1">
          <span className="text-[11px] uppercase tracking-wider text-[#B89025] font-semibold block">
            Brand Leadership
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl text-slate-900 font-bold">
            Founder & CEO: Ashar Ul Haq Siddiqui
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            Under the leadership of Founder & CEO Ashar Ul Haq Siddiqui, MUAVER is dedicated to creating exceptional, high-concentration fragrances with rare ingredients and timeless presentation. Every perfume reflects an uncompromising commitment to quality, longevity, and distinction.
          </p>
        </div>
      </div>

      {/* Royal Crest Presentation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-slate-200">
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-[#D4AF37] p-1.5 bg-[#0A1A4F] shadow-md flex items-center justify-center overflow-hidden shrink-0">
            <img
              src={settings.iconUrl || 'https://i.ibb.co/M5Dq0xS9/Icon.png'}
              alt="MUAVER Signature Emblem"
              width={208}
              height={208}
              loading="eager"
              decoding="async"
              className="w-full h-full rounded-full object-cover object-center"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="pt-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium text-center">
            Signature Emblem
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h2 className="font-cinzel text-2xl sm:text-3xl text-slate-900 font-bold tracking-tight">
            {settings.aboutStoryTitle || 'The Heritage Behind The Insignia'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {settings.aboutStoryP1 ||
              'The insignia of MUAVER tells the story of our philosophy: a signature crown resting above the interlocked "MV" monogram, wrapped in ceremonial laurel flourishes. Cast against deep navy — chosen to symbolize depth, discipline, and timeless presence.'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {(settings.aboutStoryP2 ||
              'Behind the brand stands Founder & CEO Ashar Ul Haq Siddiqui — dedicated to crafting singular fragrant works of art without compromise, without synthetic dilution, and without ordinary formulations.').replace(/AUHS/g, 'Ashar Ul Haq Siddiqui')}
          </p>
        </div>
      </div>

      {/* Guiding Principles */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#B89025] font-semibold">
            Our Standards
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl text-slate-900 font-bold">
            THREE COMMITMENTS TO QUALITY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#B89025]">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900">
              {settings.aboutLaw1Title || '35% Oil Concentration'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              {settings.aboutLaw1Desc ||
                'Formulated at 35% pure perfume oils, ensuring every application produces a deep, persistent scent that lasts from morning to night.'}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#B89025]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900">
              {settings.aboutLaw2Title || '16+ Hours Longevity'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              {settings.aboutLaw2Desc ||
                'Meticulously layered so base notes hold firm on skin and fabrics through weather changes and extended workdays.'}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#B89025]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900">
              {settings.aboutLaw3Title || 'Doorstep Cash on Delivery'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              {settings.aboutLaw3Desc ||
                'Delivered nationwide with secure packaging, transparent inspection, and cash on delivery across Pakistan.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-3">
        <h3 className="font-cinzel text-xl sm:text-2xl text-slate-900 font-bold">
          Explore The Collection
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto font-light">
          Experience the difference of high-concentration luxury perfumery.
        </p>
        <div className="pt-1">
          <button
            onClick={() => onNavigate('shop')}
            className="btn-gold px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Browse All Perfumes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
