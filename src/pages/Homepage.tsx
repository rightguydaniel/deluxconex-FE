// Homepage.tsx
import { Contact } from "../components/Homepage/Contact";
import { Features } from "../components/Homepage/Features";
import { Footer } from "../components/Homepage/Footer";
import { Hero } from "../components/Homepage/Hero";
import { History } from "../components/Homepage/History";
import { PricedSaleSection } from "../components/Homepage/PricedSaleSection";
import { SaleSection } from "../components/Homepage/SaleSection";
import { ServiceArea } from "../components/Homepage/ServiceArea";
import { Header } from "../components/Header";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Sidebar } from "../components/Sidebar";
import { Helmet } from "react-helmet-async";
import {
  buildCanonicalUrl,
  seoConfig,
  serializeJsonLd,
} from "../config/seo";

export const Homepage = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(isLargeScreen);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+1-786-952-9946",
        contactType: "sales",
        areaServed: "US",
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Helmet>
        <title>Shipping Container Sales, Rentals & Mods | {seoConfig.siteName}</title>
        <meta
          name="description"
          content="Explore new, used, and custom shipping containers for sale or rent. DeluxConex delivers turnkey container solutions, cold storage, and nationwide logistics."
        />
        <link rel="canonical" href={buildCanonicalUrl("/")} />
        <meta property="og:title" content="Shipping Container Sales, Rentals & Mods" />
        <meta
          property="og:description"
          content="Nationwide shipping container sales, rentals, and modifications. Request a quote today to customize cold storage, mobile offices, and more."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl("/")} />
        <meta property="og:site_name" content={seoConfig.siteName} />
        {seoConfig.twitterHandle && (
          <meta name="twitter:site" content={seoConfig.twitterHandle} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {serializeJsonLd(organizationJsonLd)}
        </script>
      </Helmet>
      {/* Sidebar - Hidden on mobile by default, shown on large screens */}
      {showSidebar && (
        <div
          className={`lg:sticky z-30 top-0 h-screen overflow-y-auto transition-all duration-300 ${
            showSidebar ? "left-0 sticky" : "-left-64"
          }`}
        >
          <Sidebar />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Header - Only shown on small screens */}
        <div className="lg:hidden fixed top-0 z-20 w-full">
          <Header onMenuClick={toggleSidebar} />
        </div>

        {/* Overlay for mobile sidebar */}
        {showSidebar && !isLargeScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Page Content */}
        <div className="pt-10 lg:pt-0">
          <Hero />
          <SaleSection />
          <Features />
          <PricedSaleSection />
          <History />
          <ServiceArea />
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
};
