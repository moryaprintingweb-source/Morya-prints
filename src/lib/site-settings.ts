import { useEffect, useState } from "react";
import { api } from "./api";

export type SiteSettingMap = Record<string, { value: string; label: string }>;

export const defaultBusinessSettings: SiteSettingMap = {
  business_phone_display: { value: "+91 85548 42103", label: "Phone display text" },
  business_phone_link: { value: "+918554842103", label: "Phone link number" },
  business_whatsapp_number: { value: "918554842103", label: "WhatsApp number" },
  business_email: { value: "Moryaprintingweb@gmail.com", label: "Email address" },
  business_address: {
    value: "Shop No. 3, Jeet Building, near Jeet Ground, Lokmanya Colony, Kothrud, Pune 411038",
    label: "Business address",
  },
  business_maps_url: {
    value: "https://maps.app.goo.gl/TSBbNMXqBig85rtJ9",
    label: "Google Maps URL",
  },
  business_google_url: {
    value: "https://share.google/3stt5fmHZPr0ByYUY",
    label: "Google Business Profile URL",
  },
};

export function usePublicSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingMap>(defaultBusinessSettings);

  useEffect(() => {
    api<{ settings: SiteSettingMap }>("/api/site-settings")
      .then((result) =>
        setSettings({
          ...defaultBusinessSettings,
          ...result.settings,
        }),
      )
      .catch(() => setSettings(defaultBusinessSettings));
  }, []);

  const getSetting = (key: keyof typeof defaultBusinessSettings) =>
    settings[key]?.value?.trim() || defaultBusinessSettings[key].value;

  return { settings, getSetting };
}

export function whatsappHref(number: string, message?: string) {
  const cleanNumber = number.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
