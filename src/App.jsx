import { Routes, Route } from 'react-router-dom';
import { useMediaQuery } from './hooks/useMediaQuery';
import DesktopLayout from './layouts/DesktopLayout';
import MobileLayout from './layouts/MobileLayout';

// Pages
import Home from './pages/Home';
import ArsipFoto from './pages/ArsipFoto';
import Upload from './pages/Upload';
import Tentang from './pages/Tentang';
import Undi from './pages/Undi';
import PanduanUpload from './pages/PanduanUpload';
import Pengaturan from './pages/Pengaturan';
import Dokumentasi from './pages/Dokumentasi';
import ResultView from './pages/ResultView';

// ... other pages

function App() {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const Layout = isMobile ? MobileLayout : DesktopLayout;

    return (
        <Layout>
            <Routes>
                <Route path="/dokumentasi" element={<Dokumentasi />} />
                <Route path="/" element={<Home />} />
                <Route path="/r/:id" element={<ResultView />} />
                <Route path="/arsipfoto" element={<ArsipFoto />} />
                <Route path="/undi" element={<Undi />} />
                <Route path="/undi/r/:id" element={<ResultView />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/tentang" element={<Tentang />} />
                <Route path="/panduan-upload" element={<PanduanUpload />} />
                <Route path="/pengaturan" element={<Pengaturan />} />

                {/* Home routes with dynamic params */}
                <Route path="/:smtParam" element={<Home />} />
                <Route path="/:smtParam/:courseName" element={<Home />} />
                <Route path="/:smtParam/:courseName/:materialName" element={<Home />} />

                {/* Fallback to Home */}
                <Route path="*" element={<Home />} />
            </Routes>
        </Layout>
    );
}

export default App;
