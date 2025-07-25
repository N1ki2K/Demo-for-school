import React, { useEffect, useRef } from "react";

const GoogleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const API_KEY = "AIzaSyC058TbkmVBGzl4LEHBEjziFx-ncyWId98";

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;
      const center = { lat: 42.396025, lng: 25.641405}; // Координати на ОУ "Кольо Ганчев"
      const map = new google.maps.Map(mapRef.current, {
        zoom: 16,
        center,
      });

      new google.maps.Marker({
        position: center,
        map,
        title: "ОУ „Кольо Ганчев“",
      });
    };

    // Зареждане на Google Maps script
    if (!(window as any).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default GoogleMap;
