/**
 * Type declarations for dynamically loaded pdfmake (0.2.12)
 * Loaded via <script> tag in wizard handleGenerate callbacks.
 */
declare global {
  interface Window {
    pdfMake?: {
      vfs: Record<string, string>;
      fonts: Record<string, unknown>;
      createPdf: (docDefinition: Record<string, unknown>) => {
        download: (filename?: string) => void;
        getDataUrl: (cb: (dataUri: string) => void) => void;
      };
    };
    ftdVFS?: Record<string, string>;
  }
}

export {};