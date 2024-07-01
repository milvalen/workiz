import ReactDOM from 'react-dom/client';
import { AddJob } from './jobs';
import './app/index.pcss';
import './assets/styles/reset.scss';
import './assets/styles/global.scss';
import { HashRouter, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <Routes>
      <Route path="*" element={<AddJob />} />
    </Routes>
  </HashRouter>
);
