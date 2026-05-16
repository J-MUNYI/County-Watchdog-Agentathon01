/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import Overview from './components/Overview';
import BudgetUpload from './components/BudgetUpload';
import QueryFeed from './components/QueryFeed';
import GazetteMonitor from './components/GazetteMonitor';
import CitizenPortal from './components/CitizenPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Overview />;
      case 'citizen': return <CitizenPortal />;
      case 'upload': return <BudgetUpload />;
      case 'queries': return <QueryFeed />;
      case 'gazette': return <GazetteMonitor />;
      default: return <Overview />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

