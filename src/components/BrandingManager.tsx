import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, Save, RefreshCw, Palette, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSupabaseData, setSupabaseData } from '@/lib/supabaseHelpers';

interface BrandingData {
  schoolName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

const BrandingManager = () => {
  const [branding, setBranding] = useState<BrandingData>({
    schoolName: "Royal Academy",
    tagline: "Excellence in Education",
    logoUrl: "",
    faviconUrl: "",
    primaryColor: "#1e40af",
    secondaryColor: "#f59e0b",
    accentColor: "#10b981",
    contactEmail: "info@royalacademy.edu",
    contactPhone: "+1 (555) 123-4567",
    address: "123 Education Street, Knowledge City, ED 12345"
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBranding = async () => {
      try {
        const brandingData = await getSupabaseData<BrandingData>('royal-academy-branding', {
          schoolName: "Royal Academy",
          tagline: "Excellence in Education",
          logoUrl: "",
          faviconUrl: "",
          primaryColor: "#1e40af",
          secondaryColor: "#f59e0b",
          accentColor: "#10b981",
          contactEmail: "info@royalacademy.edu",
          contactPhone: "+1 (555) 123-4567",
          address: "123 Education Street, Knowledge City, ED 12345"
        });

        setBranding(brandingData);
      } catch (error: any) {
        console.error('[BrandingManager] Error fetching branding:', error);
      }
    };

    fetchBranding();
  }, []);

  const saveBranding = async () => {
    try {
      // Save to Supabase (which also saves to localStorage)
      const success = await setSupabaseData('royal-academy-branding', branding);

      if (success) {
        setMessage("✅ Branding updated successfully! Changes will appear across all pages.");
      } else {
        setMessage("⚠️ Branding saved locally but Supabase sync had issues. Changes will still work.");
      }

      // Update document title immediately for preview
      document.title = `${branding.schoolName} - ${branding.tagline}`;

      // Trigger a page reload after 2 seconds to show changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('[BrandingManager] Error saving branding:', error);
      setMessage(`❌ Error saving branding: ${error.message}`);
    }

    setTimeout(() => setMessage(""), 5000);
  };

  const updateField = (field: keyof BrandingData, value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Branding & Logo Management
        </h2>
        <p className="text-muted-foreground">
          Update your school's navigation logo (top-left corner), colors, and branding information
        </p>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Logo Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <ImageIcon className="h-5 w-5 text-gold" />
          <h3 className="text-lg font-semibold">Navigation Logo (Top-Left Corner)</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Current Logo</label>
            {branding.logoUrl ? (
              <div className="flex items-center space-x-4">
                <img 
                  src={branding.logoUrl} 
                  alt="School Logo" 
                  className="h-16 w-16 object-contain border border-border rounded"
                />
                <Button
                  variant="outline"
                  onClick={() => updateField('logoUrl', '')}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove Logo
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No logo uploaded</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload New Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    updateField('logoUrl', event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-gold/80"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This logo will appear in the top-left corner of the navigation bar
            </p>
          </div>
        </div>
      </motion.div>

      {/* School Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Type className="h-5 w-5 text-gold" />
          <h3 className="text-lg font-semibold">School Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">School Name</label>
            <Input
              value={branding.schoolName}
              onChange={(e) => updateField('schoolName', e.target.value)}
              placeholder="Royal Academy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tagline</label>
            <Input
              value={branding.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              placeholder="Excellence in Education"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Email</label>
            <Input
              type="email"
              value={branding.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="info@royalacademy.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contact Phone</label>
            <Input
              type="tel"
              value={branding.contactPhone}
              onChange={(e) => updateField('contactPhone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Address</label>
            <Textarea
              value={branding.address}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 Education Street, Knowledge City, ED 12345"
              rows={2}
            />
          </div>
        </div>
      </motion.div>

      {/* Color Scheme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="h-5 w-5 text-gold" />
          <h3 className="text-lg font-semibold">Brand Colors</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={branding.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                value={branding.primaryColor}
                onChange={(e) => updateField('primaryColor', e.target.value)}
                placeholder="#1e40af"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={branding.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                className="w-12 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                value={branding.secondaryColor}
                onChange={(e) => updateField('secondaryColor', e.target.value)}
                placeholder="#f59e0b"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Accent Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={branding.accentColor}
                onChange={(e) => updateField('accentColor', e.target.value)}
                className="w-12 h-10 rounded border border-border cursor-pointer"
              />
              <Input
                value={branding.accentColor}
                onChange={(e) => updateField('accentColor', e.target.value)}
                placeholder="#10b981"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Preview Changes
        </Button>
        <Button onClick={saveBranding} className="bg-gradient-to-r from-royal to-gold text-white">
          <Save className="h-4 w-4 mr-2" />
          Save Branding
        </Button>
      </div>
    </div>
  );
};

export default BrandingManager;