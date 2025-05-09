
import React, { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import TabContent from "@/components/TabContent";
import { AppContextProvider } from "@/context/AppContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("terreno");

  return (
    <AppContextProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <div className="flex-grow">
          <div className="bg-white shadow-sm">
            <div className="container mx-auto">
              <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
            </div>
          </div>
          <div className="tab-content">
            <TabContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </AppContextProvider>
  );
};

export default Index;
