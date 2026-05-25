import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Card } from '@admitiq/ui';

function Widget() {
  return (
    <Card title="AdmitIQ Call Summary">
      <p style={{ margin: 0, color: '#64748b' }}>
        Embed this widget in LeadSquared / Meritto to show disposition, transcript link, and slots.
      </p>
    </Card>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Widget />
  </StrictMode>,
);
