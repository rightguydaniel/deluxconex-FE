import { useMediaQuery } from "react-responsive";
import { Contact } from "../components/Homepage/Contact";
import { Footer } from "../components/Homepage/Footer";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Helmet } from "react-helmet-async";
import { buildCanonicalUrl, seoConfig } from "../config/seo";

export const Inventory = () => {
  const isLargeScreen = useMediaQuery({ minWidth: 1024 });
  const [showSidebar, setShowSidebar] = useState(isLargeScreen);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Helmet>
        <title>Available Container Inventory | {seoConfig.siteName}</title>
        <meta
          name="description"
          content="View available shipping containers ready for quick delivery. Compare sizes, conditions, and custom options filtered by your project needs."
        />
        <link rel="canonical" href={buildCanonicalUrl("/inventory")} />
        <meta property="og:title" content="Available Container Inventory" />
        <meta
          property="og:description"
          content="Check current shipping container stock across new, used, and refurbished units with nationwide availability."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl("/inventory")} />
        <meta property="og:site_name" content={seoConfig.siteName} />
        <meta name="twitter:card" content="summary_large_image" />
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
          <Contact />
          <Footer />
        </div>
      </div>
    </div>
  );
};
