import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Share2, Copy, QrCode, Check } from "lucide-react";
import QRCodeGenerator from "../components/QRCodeGenerator";

export default function FormShare() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const formId = urlParams.get('id');
      
      if (formId) {
        const forms = await base44.entities.Form.list();
        const foundForm = forms.find(f => f.id === formId);
        setForm(foundForm);
      }
    } catch (error) {
      console.error("Error loading form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="neu-card p-6 sm:p-8">
          <div className="animate-pulse text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="neu-card p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800">Form not found</h2>
      </div>
    );
  }

  const formUrl = `${window.location.origin}${createPageUrl(`FormView?id=${form.id}`)}`;
  const embedCode = `<iframe src="${formUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform) => {
    const encodedUrl = encodeURIComponent(formUrl);
    const text = encodeURIComponent(`Check out this form: ${form.title}`);
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };
    
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="neu-card p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Share2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Share Form</h1>
        </div>
        <p className="text-gray-600">Share "{form.title}" with the world</p>
      </div>

      {/* Direct Link */}
      <div className="neu-card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Direct Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={formUrl}
            readOnly
            className="neu-input flex-1 px-4 py-3 text-gray-700"
          />
          <button
            onClick={() => copyToClipboard(formUrl)}
            className="neu-button px-4 py-3 rounded-lg flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Social Media */}
      <div className="neu-card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Share on Social Media</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => shareOnSocial('facebook')}
            className="neu-button px-4 py-3 rounded-lg flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-sm">Facebook</span>
          </button>
          
          <button
            onClick={() => shareOnSocial('twitter')}
            className="neu-button px-4 py-3 rounded-lg flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-sm">Twitter</span>
          </button>
          
          <button
            onClick={() => shareOnSocial('linkedin')}
            className="neu-button px-4 py-3 rounded-lg flex flex-col items-center space-y-2 text-gray-700 hover:text-gray-900"
          >
            <Share2 className="w-6 h-6" />
            <span className="text-sm">LinkedIn</span>
          </button>
        </div>
      </div>

      {/* QR Code */}
      <div className="neu-card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">QR Code</h3>
          <button
            onClick={() => setShowQR(!showQR)}
            className="neu-button px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <QrCode className="w-5 h-5" />
            <span>{showQR ? 'Hide' : 'Generate'} QR Code</span>
          </button>
        </div>
        
        {showQR && (
          <div className="flex justify-center mt-4">
            <QRCodeGenerator url={formUrl} title={form.title} />
          </div>
        )}
      </div>

      {/* Embed Code */}
      <div className="neu-card p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Embed on Website</h3>
        <div className="space-y-3">
          <textarea
            value={embedCode}
            readOnly
            rows={3}
            className="neu-input w-full px-4 py-3 text-gray-700 text-sm font-mono"
          />
          <button
            onClick={() => copyToClipboard(embedCode)}
            className="neu-button px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? 'Copied!' : 'Copy Embed Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}