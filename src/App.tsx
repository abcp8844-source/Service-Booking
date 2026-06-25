/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OwnerPortal from './components/OwnerPortal';
import PWAInstallPrompt from './components/PWAInstallPrompt';

export default function App() {
  return (
    <BrowserRouter>
      <PWAInstallPrompt />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/owner" element={<OwnerPortal />} />
      </Routes>
    </BrowserRouter>
  );
}
