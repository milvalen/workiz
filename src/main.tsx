import ReactDOM from 'react-dom/client';
import { AddJob } from './jobs';
import './app/index.pcss';
import './assets/styles/reset.scss';
import './assets/styles/global.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<AddJob />} />
    </Routes>
  </BrowserRouter>
);
