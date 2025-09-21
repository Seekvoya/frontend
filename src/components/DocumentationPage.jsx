import React from 'react';
import PageLayout from '../components/PageLayout';

const DocumentationPage = ({ user, userData, onLogout }) => {
  // путь к PDF в public (положите файл public/docs/documentation.pdf)
  const pdfPath = './docs/documentation.pdf';

  return (
    <PageLayout activeTab="docs" onLogout={onLogout} user={user} balance={userData?.balance}>
        <section className="balance-section">
        <h2>Документация</h2>
        </section>

      <div className="balance-section docs-container">
        <div className="docs-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ color: '#8b949e' }}>
            В этом разделе доступна актуальная документация проекта.
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <a
              className="btn-ghost"
              href={pdfPath}
              target="_blank"
              rel="noopener noreferrer"
            >
              Открыть в новой вкладке
            </a>

            <a
              className="top-up-button"
              href={pdfPath}
              download="documentation.pdf"
            >
              Скачать PDF
            </a>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          {/* iframe для десктопа, на мобильных будет показан fallback link + кнопки выше */}
          <div className="pdf-wrapper">
            <iframe
              title="Документация"
              src={pdfPath}
              frameBorder="0"
              style={{ width: '100%', height: '800px', borderRadius: 8 }}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentationPage;
