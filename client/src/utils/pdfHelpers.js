/**
 * Safely opens a PDF (URL or Base64 Data URI) in a new browser tab.
 * Converts Base64 Data URIs into Blob URLs so modern browser PDF viewers render them cleanly.
 */
export const openPdfInNewTab = (dataUriOrUrl) => {
  if (!dataUriOrUrl) return;

  if (dataUriOrUrl.startsWith('data:application/pdf;base64,')) {
    try {
      const base64Data = dataUriOrUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
      return;
    } catch (e) {
      console.error('[pdfHelpers] Error opening base64 PDF in new tab:', e);
    }
  }

  window.open(dataUriOrUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Triggers a client-side file download for a PDF (URL or Base64 Data URI).
 */
export const downloadPdf = async (dataUriOrUrl, filename = 'Venkata_Siva_Reddy_Resume.pdf') => {
  if (!dataUriOrUrl) return;

  try {
    let blobUrl;

    if (dataUriOrUrl.startsWith('data:application/pdf;base64,')) {
      const base64Data = dataUriOrUrl.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      blobUrl = URL.createObjectURL(blob);
    } else {
      const response = await fetch(dataUriOrUrl);
      const blob = await response.blob();
      blobUrl = URL.createObjectURL(blob);
    }

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch (e) {
    console.error('[pdfHelpers] Error downloading PDF:', e);
    // Fallback for cross-origin or fetch errors
    const link = document.createElement('a');
    link.href = dataUriOrUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
