import { useState, useCallback, useEffect } from 'preact/hooks';

// ============ Types ============
interface FormData {
  trustName: string;
  trusteeName: string;
  trusteeAddress: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
  propertyDescription: string;
  propertyAddress: string;
  governingState: string;
  trustTerm: 'life' | 'fixed' | '';
  fixedTerm: string;
  successorBeneficiary: string;
  trusteeCompensation: 'no' | 'reasonable' | '';
  ackDisclaim: boolean;
}

const initialData: FormData = {
  trustName: '',
  trusteeName: '',
  trusteeAddress: '',
  beneficiaryName: '',
  beneficiaryAddress: '',
  propertyDescription: '',
  propertyAddress: '',
  governingState: '',
  trustTerm: '',
  fixedTerm: '',
  successorBeneficiary: '',
  trusteeCompensation: '',
  ackDisclaim: false,
};

const STORAGE_KEY = 'freetrustdocs.land-trust.draft.v1';

interface StoredDraft {
  data: FormData;
  step: number;
}

// One continuous shell — each entry is a section within the same flow.
// `label` names the progress segment, `title` heads the section,
// `cont` is the specific Continue action for that section.
const STEPS: { label: string; title: string; desc?: string; cont: string }[] = [
  {
    label: 'Document',
    title: 'Document information',
    desc: 'Identify the land trust.',
    cont: 'Continue to trustee',
  },
  {
    label: 'Trustee',
    title: 'Who is the trustee?',
    desc: 'The trustee holds legal title to the property. Their name appears on public records.',
    cont: 'Continue to beneficiary',
  },
  {
    label: 'Beneficiary',
    title: 'Who is the beneficiary?',
    desc: 'The beneficiary holds the beneficial interest — the real owner. Their name stays private.',
    cont: 'Continue to property',
  },
  {
    label: 'Property',
    title: 'What property is held in trust?',
    desc: 'Describe the real property held in the land trust.',
    cont: 'Continue to governing state',
  },
  {
    label: 'State',
    title: 'Governing state',
    desc: 'Land trusts are recognized only in certain states.',
    cont: 'Continue to term & succession',
  },
  {
    label: 'Term',
    title: 'Term and succession',
    desc: 'How long the trust lasts and who receives the beneficial interest on death.',
    cont: 'Review answers',
  },
  {
    label: 'Review',
    title: 'Review your answers',
    desc: 'Check everything before generating your PDF.',
    cont: 'Generate PDF',
  },
  {
    label: 'Download',
    title: 'Your Land Trust Agreement',
    desc: 'Generate and download your PDF.',
    cont: 'Download',
  },
];

const LAND_TRUST_STATES = [
  'Illinois', 'Florida', 'Indiana', 'North Dakota', 'Virginia', 'Ohio', 'Georgia',
];

// ============ local draft persistence ============
function loadDraft(): StoredDraft {
  const blank = { data: initialData, step: 0 };
  if (typeof window === 'undefined') return blank;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const data = { ...initialData, ...(parsed.data || {}) };
      const step =
        Number.isFinite(parsed.step)
          ? Math.max(0, Math.min(parsed.step, STEPS.length - 1))
          : 0;
      return { data, step };
    }
  } catch {
    /* ignore corrupted or unavailable storage */
  }
  return blank;
}

function saveDraft(data: FormData, step: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }));
  } catch {
    /* storage full/unavailable — leave draft in memory */
  }
}

// ============ inline validation ============
// Returns a map of field → human-readable error for the current section.
function validateSection(step: number, data: FormData): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  switch (step) {
    case 0:
      if (!data.trustName.trim()) errors.trustName = 'Enter the trust name.';
      break;
    case 1:
      if (!data.trusteeName.trim()) errors.trusteeName = 'Enter the trustee name.';
      if (!data.trusteeAddress.trim()) errors.trusteeAddress = 'Enter the trustee address.';
      break;
    case 2:
      if (!data.beneficiaryName.trim()) errors.beneficiaryName = 'Enter the beneficiary name.';
      if (!data.beneficiaryAddress.trim()) errors.beneficiaryAddress = 'Enter the beneficiary address.';
      break;
    case 3:
      if (!data.propertyDescription.trim()) errors.propertyDescription = 'Enter the legal description.';
      if (!data.propertyAddress.trim()) errors.propertyAddress = 'Enter the property address.';
      break;
    case 4:
      if (!data.governingState) errors.governingState = 'Select a governing state.';
      break;
    case 5:
      if (!data.trustTerm) errors.trustTerm = 'Choose the trust term.';
      else if (data.trustTerm === 'fixed' && !data.fixedTerm.trim()) {
        errors.fixedTerm = 'Enter the fixed term.';
      }
      if (!data.successorBeneficiary.trim()) errors.successorBeneficiary = 'Enter the successor beneficiary.';
      if (!data.trusteeCompensation) errors.trusteeCompensation = 'Choose a compensation option.';
      break;
    case 6:
      if (!data.ackDisclaim) errors.ackDisclaim = 'Please acknowledge before downloading.';
      break;
    default:
      break;
  }
  return errors;
}

// ============ PDF Generator ============
function generatePDF(data: FormData): void {
  const pdfMake = window.pdfMake;
  if (!pdfMake) {
    throw new Error('PDF generator is not loaded');
  }

  const durationText =
    data.trustTerm === 'fixed'
      ? `This Agreement shall continue for a fixed term of ${data.fixedTerm || '________________'}, unless sooner terminated in accordance with Article VII of this Agreement. Upon expiration of the term, the Trustee shall reconvey the Trust Property to the Beneficiary or as the Beneficiary shall direct in writing.`
      : 'This Agreement shall continue for the lifetime of the Beneficiary, unless sooner terminated in accordance with Article VII of this Agreement. Upon the death of the Beneficiary, the beneficial interest shall pass in accordance with Article VI of this Agreement.';

  const compensationText =
    data.trusteeCompensation === 'reasonable'
      ? 'The Trustee shall be entitled to reasonable compensation for services rendered, as agreed between the Trustee and the Beneficiary or as determined in accordance with applicable law.'
      : 'The Trustee shall serve without compensation.';

  const notaryBlock = [
    { text: '\n\n', fontSize: 10 },
    { text: 'NOTARY ACKNOWLEDGMENT', style: 'sectionHeader', alignment: 'center' },
    { text: '\n', fontSize: 8 },
    {
      text: `State of ${data.governingState || '____________'}\nCounty of ________________\n\nOn this _____ day of ____________, 20____, before me, a Notary Public in and for said State, personally appeared ${data.trusteeName || '________________'} and ${data.beneficiaryName || '________________'}, proved to me through satisfactory evidence to be the persons whose names are subscribed above, and acknowledged that they executed the foregoing Land Trust Agreement as their free and voluntary act and deed for the purposes therein stated.\n\n_______________________________\nNotary Public\nMy Commission Expires: ____________`,
      fontSize: 10,
      lineHeight: 1.5,
    },
  ];

  const docDefinition = {
    pageSize: 'LETTER' as const,
    pageMargins: [72, 72, 72, 72],
    defaultStyle: {
      fontSize: 11,
      lineHeight: 1.5,
      font: 'Inter',
    },
    content: [
      // Title
      { text: 'LAND TRUST AGREEMENT', style: 'docTitle', alignment: 'center' },
      { text: '\n', fontSize: 8 },
      {
        text: `TRUST AGREEMENT OF ${(data.trustName || '[TRUST NAME]').toUpperCase()}`,
        style: 'subtitle',
        alignment: 'center',
      },
      { text: '\n\n', fontSize: 10 },

      // Parties
      { text: 'PARTIES', style: 'sectionHeader' },
      {
        text: `This Land Trust Agreement (this "Agreement") is made and entered into by and between ${data.trusteeName || '[TRUSTEE NAME]'} (the "Trustee") and ${data.beneficiaryName || '[BENEFICIARY NAME]'} (the "Beneficiary").`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Recitals
      { text: 'RECITALS', style: 'sectionHeader' },
      {
        text: 'WHEREAS, the Beneficiary desires to hold real property in trust for purposes of privacy, probate avoidance, and ease of transfer; and',
        fontSize: 11,
      },
      { text: '\n', fontSize: 4 },
      {
        text: 'WHEREAS, the Trustee agrees to hold legal title to the property described herein, subject to the direction of the Beneficiary, upon the terms and conditions set forth in this Agreement;',
        fontSize: 11,
      },
      { text: '\n', fontSize: 4 },
      {
        text: 'NOW, THEREFORE, in consideration of the mutual covenants and agreements herein, the parties agree as follows:',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 8 },

      // Article I: Trust Property
      { text: 'ARTICLE I — TRUST PROPERTY', style: 'sectionHeader' },
      {
        text: `The Trustee shall hold legal title to the following real property (the "Trust Property"):\n\nLegal Description: ${data.propertyDescription || '[LEGAL DESCRIPTION]'}\n\nAddress: ${data.propertyAddress || '[PROPERTY ADDRESS]'}` + '\n\nThe Beneficiary hereby assigns and conveys all right, title, and interest in the Trust Property to the Trustee, subject to the terms of this Agreement. The Trustee shall hold the Trust Property in trust for the benefit of the Beneficiary.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article II: Beneficial Interest
      { text: 'ARTICLE II — BENEFICIAL INTEREST', style: 'sectionHeader' },
      {
        text: 'The beneficial interest in the Trust Property shall be personal property. The Beneficiary shall hold the beneficial interest, which shall entitle the Beneficiary to all income, proceeds, and benefits from the Trust Property. The beneficial interest may be assigned, sold, or transferred in accordance with Article VIII of this Agreement, without the necessity of recording a deed.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article III: Trustee Powers
      { text: 'ARTICLE III — TRUSTEE POWERS', style: 'sectionHeader' },
      {
        text: 'The Trustee shall have the power to execute deeds, mortgages, leases, and other instruments necessary to convey, encumber, or manage the Trust Property, but ONLY upon the written direction of the Beneficiary. The Trustee shall have no independent authority to sell, lease, mortgage, or otherwise convey or encumber the Trust Property except as directed in writing by the Beneficiary. The Trustee shall act solely as a fiduciary and shall have no personal interest in the Trust Property.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article IV: Power of Direction
      { text: 'ARTICLE IV — POWER OF DIRECTION', style: 'sectionHeader' },
      {
        text: 'The Beneficiary shall have the exclusive right to direct the Trustee in all matters relating to the Trust Property, including the right to direct the Trustee to sell, lease, mortgage, or convey the Trust Property, to execute and deliver deeds and other instruments, and to manage and maintain the Trust Property. The Trustee shall act only upon written direction from the Beneficiary.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article V: Term and Renewal
      { text: 'ARTICLE V — TERM AND RENEWAL', style: 'sectionHeader' },
      { text: durationText, fontSize: 11 },
      { text: '\n', fontSize: 6 },

      // Article VI: Succession
      { text: 'ARTICLE VI — SUCCESSION', style: 'sectionHeader' },
      {
        text: `Upon the death of the Beneficiary, the beneficial interest in the Trust Property shall pass to ${data.successorBeneficiary || '[SUCCESSOR BENEFICIARY]'} (the "Successor Beneficiary"). The Successor Beneficiary shall succeed to all rights of the Beneficiary under this Agreement, including the power of direction. This transfer shall not require probate or any court proceeding.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article VII: Revocation
      { text: 'ARTICLE VII — REVOCATION', style: 'sectionHeader' },
      {
        text: 'The Beneficiary may revoke this trust at any time by giving written notice to the Trustee. Upon revocation, the Trustee shall reconvey the Trust Property to the Beneficiary by deed, and this Agreement shall terminate.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article VIII: Assignment
      { text: 'ARTICLE VIII — ASSIGNMENT OF BENEFICIAL INTEREST', style: 'sectionHeader' },
      {
        text: 'The Beneficiary may assign, sell, or transfer all or any portion of the beneficial interest in the Trust Property by executing a written assignment. No assignment of the beneficial interest shall require the recording of a deed or other instrument in public records. The assignee shall succeed to all rights of the Beneficiary under this Agreement.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article IX: Trustee Compensation
      { text: 'ARTICLE IX — TRUSTEE COMPENSATION', style: 'sectionHeader' },
      { text: compensationText, fontSize: 11 },
      { text: '\n', fontSize: 6 },

      // Article X: Governing Law
      { text: 'ARTICLE X — GOVERNING LAW', style: 'sectionHeader' },
      {
        text: `This Agreement shall be governed by and construed in accordance with the laws of the State of ${data.governingState || '________________'}, without regard to its conflicts of law principles.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article XI: Miscellaneous
      { text: 'ARTICLE XI — MISCELLANEOUS', style: 'sectionHeader' },
      {
        text: 'If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. This Agreement may be executed in counterparts. The headings in this Agreement are for convenience only and shall not affect its interpretation. All notices under this Agreement shall be in writing.',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },

      // Critical notice about deed
      { text: 'IMPORTANT NOTICE', style: 'sectionHeader' },
      {
        text: 'This Land Trust Agreement does NOT include a deed to trustee. A separate deed transferring legal title from the current owner to the Trustee must be prepared and recorded in the county where the property is located. This is typically done with a title company or attorney. This tool does not generate that deed.',
        fontSize: 10,
        bold: true,
      },
      { text: '\n\n', fontSize: 10 },

      // Execution
      { text: 'EXECUTION', style: 'sectionHeader' },
      {
        text: 'IN WITNESS WHEREOF, the parties have executed this Land Trust Agreement as of the date first written above.',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },
      {
        text: 'Date: ____________________',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },

      // Trustee signature
      {
        text: '_________________________________\n' +
              `${data.trusteeName || 'Trustee Name'}\n` +
              'Trustee',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },
      {
        text: '_________________________________\n' +
              `${data.beneficiaryName || 'Beneficiary Name'}\n` +
              'Beneficiary',
        fontSize: 11,
      },

      ...notaryBlock,

      // UPL Disclaimer page
      { text: '\n\n', pageBreak: 'before' as const },
      { text: 'DISCLAIMER', style: 'sectionHeader', alignment: 'center' },
      { text: '\n', fontSize: 8 },
      {
        text: 'This document was generated by FreeTrustDocs.com, a free online trust document generator. FreeTrustDocs.com is not a law firm and does not provide legal advice. This Land Trust Agreement is a template assembled from information provided by the user and does not constitute legal advice or the practice of law. You should consult a licensed attorney in your jurisdiction before signing or filing any legal document. Use of this tool does not create an attorney-client relationship. This document does not guarantee any specific tax, asset-protection, or legal outcome, which depend on state law, how the trust is funded, and how it is administered. A land trust provides privacy, not asset protection. Not all states recognize land trusts. If your property is mortgaged, review your loan documents for due-on-sale clause restrictions before transferring to a trust. This tool does not generate the deed to trustee — that must be prepared and recorded separately. FreeTrustDocs.com makes no representation regarding the suitability of this document for any particular purpose or jurisdiction.',
        fontSize: 9,
        lineHeight: 1.5,
      },
    ],
    styles: {
      docTitle: {
        fontSize: 16,
        bold: true,
        font: 'CrimsonPro',
        decoration: 'underline',
        margin: [0, 0, 0, 4] as [number, number, number, number],
      },
      subtitle: {
        fontSize: 10,
        italics: true,
        font: 'CrimsonPro',
      },
      sectionHeader: {
        fontSize: 11,
        bold: true,
        font: 'Inter',
        margin: [0, 6, 0, 2] as [number, number, number, number],
      },
    },
    footer: (currentPage: number, pageCount: number) => ({
      text: `FreeTrustDocs.com — Page ${currentPage} of ${pageCount} — Not a law firm. Not legal advice.`,
      fontSize: 8,
      alignment: 'center',
      color: '#888888',
      margin: [0, 20, 0, 0] as [number, number, number, number],
    }),
  };

  pdfMake.createPdf(docDefinition).download(`Land-Trust-Agreement-${data.trustName || 'Document'}.pdf`);
}

// ============ Component ============
export default function LandTrustWizard() {
  const [draft, setDraft] = useState<StoredDraft>(loadDraft);
  const { data, step } = draft;
  const [generated, setGenerated] = useState(false);
  const [saveState, setSaveState] = useState<'saving' | 'saved'>('saved');
  const [attempted, setAttempted] = useState(false);

  const setData = (updater: FormData | ((p: FormData) => FormData)) => {
    setDraft((prev) => ({
      ...prev,
      data: typeof updater === 'function' ? updater(prev.data) : updater,
    }));
  };
  const setStep = (updater: number | ((s: number) => number)) => {
    setDraft((prev) => ({
      ...prev,
      step:
        typeof updater === 'function'
          ? Math.max(0, Math.min(updater(prev.step), STEPS.length - 1))
          : Math.max(0, Math.min(updater, STEPS.length - 1)),
    }));
  };

  // Persist every change to localStorage; reflect the browser-save status visibly.
  useEffect(() => {
    setSaveState('saving');
    const t = window.setTimeout(() => {
      saveDraft(data, step);
      setSaveState('saved');
    }, 250);
    return () => window.clearTimeout(t);
  }, [data, step]);

  // Reset downloaded state when user navigates away from the download step
  useEffect(() => {
    if (step !== STEPS.length - 1) {
      setGenerated(false);
    }
  }, [step]);

  const update = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(target, STEPS.length - 1));
    setStep(clamped);
    setAttempted(false);
    requestAnimationFrame(() => {
      const el = document.getElementById('wizard-step');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const next = () => {
    const errors = validateSection(step, data);
    if (Object.keys(errors).length > 0) {
      setAttempted(true);
      const firstKey = Object.keys(errors)[0];
      const el = document.getElementById(`field-${firstKey}`);
      el?.focus();
      return;
    }
    setAttempted(false);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    requestAnimationFrame(() => {
      const el = document.getElementById('wizard-step');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const prev = () => {
    setAttempted(false);
    setStep((s) => Math.max(s - 1, 0));
    requestAnimationFrame(() => {
      const el = document.getElementById('wizard-step');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(initialData);
    setGenerated(false);
    setAttempted(false);
    setStep(0);
  };

  const errors: Partial<Record<string, string>> = attempted ? validateSection(step, data) : {};
  const errorFor = (field: string) => {
    return attempted ? errors[field] : undefined;
  };

  const handleGenerate = useCallback(() => {
    if (!window.pdfMake) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js';
      script.onerror = () => {
        setGenerated(false);
        alert('Failed to load the PDF generator. Please check your internet connection and try again.');
      };
      script.onload = () => {
        const vfsScript = document.createElement('script');
        vfsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.js';
        vfsScript.onerror = () => {
          alert('Failed to load PDF fonts. Please check your internet connection and try again.');
        };
        vfsScript.onload = () => {
          // Load custom fonts (Crimson Pro + Inter) for PDF consistency with web
          const ftdVfs = document.createElement('script');
          ftdVfs.src = '/fonts/pdf/ftd-vfs.js';
          ftdVfs.onload = () => {
            const vfs = window.pdfMake!.vfs;
            if (vfs && window.ftdVFS) {
              Object.assign(vfs, window.ftdVFS);
              window.pdfMake!.fonts = {
                CrimsonPro: { normal: 'CrimsonPro.ttf', bold: 'CrimsonPro.ttf', italics: 'CrimsonPro.ttf', bolditalics: 'CrimsonPro.ttf' },
                Inter: { normal: 'Inter.ttf', bold: 'Inter.ttf', italics: 'Inter.ttf', bolditalics: 'Inter.ttf' },
                ...(window.pdfMake!.fonts || {}),
              };
            }
            try {
              generatePDF(data);
              setGenerated(true);
            } catch (e) {
              alert('Failed to generate PDF. Please try again.');
            }
          };
          ftdVfs.onerror = () => { try { generatePDF(data); setGenerated(true); } catch (e) { alert('Failed to generate PDF. Please try again.'); } };
          document.head.appendChild(ftdVfs);
        };
        document.head.appendChild(vfsScript);
      };
      document.head.appendChild(script);
    } else {
      try {
        generatePDF(data);
        setGenerated(true);
      } catch (e) {
        alert('Failed to generate PDF. Please try again.');
      }
    }
  }, [data]);

  const inputClass = (field: string) =>
    `wizard-input${errorFor(field) ? ' wizard-input--invalid' : ''}`;

  const fieldWrap = (field: string, children: any) => (
    <div class="wizard-field" id={`field-${field}`}>
      {children}
      {errorFor(field) && <span class="wizard-error" role="alert">{errorFor(field)}</span>}
    </div>
  );

  const labelFor = (field: string, text: string) => (
    <label class="wizard-label" for={field}>{text}</label>
  );

  // Review groups — each links straight back to its home section (edit continuity).
  const fmt = (v: string | boolean | undefined) => {
    if (v === undefined || v === null || v === '') return '—';
    if (typeof v === 'boolean') return v ? 'Yes' : 'No';
    return String(v);
  };

  const durationLabel = data.trustTerm === 'fixed' ? `Fixed term (${data.fixedTerm || '—'})` : data.trustTerm === 'life' ? 'Lifetime of beneficiary' : '';
  const compensationLabel = data.trusteeCompensation === 'reasonable' ? 'Reasonable compensation' : data.trusteeCompensation === 'no' ? 'No compensation' : '';

  const reviewGroups = [
    { title: 'Document', step: 0, rows: [{ k: 'Trust name', v: data.trustName }] },
    { title: 'Trustee', step: 1, rows: [{ k: 'Trustee name', v: data.trusteeName }, { k: 'Trustee address', v: data.trusteeAddress }] },
    { title: 'Beneficiary', step: 2, rows: [{ k: 'Beneficiary name', v: data.beneficiaryName }, { k: 'Beneficiary address', v: data.beneficiaryAddress }] },
    { title: 'Property', step: 3, rows: [{ k: 'Legal description', v: data.propertyDescription }, { k: 'Property address', v: data.propertyAddress }] },
    { title: 'Governing state', step: 4, rows: [{ k: 'Governing state', v: data.governingState }] },
    { title: 'Term & succession', step: 5, rows: [{ k: 'Trust term', v: durationLabel }, { k: 'Successor beneficiary', v: data.successorBeneficiary }, { k: 'Trustee compensation', v: compensationLabel }] },
  ];

  const current = STEPS[step];

  return (
    <div class="wizard-container">
      <div class="wizard-statusbar">
        <span class={`wizard-save ${saveState}`}>
          <span class="wizard-save-dot" aria-hidden="true" />
          {saveState === 'saving' ? 'Saving…' : 'Saved in this browser'}
          <span class="wizard-save-hint">· nothing leaves your device</span>
        </span>
        <button type="button" class="wizard-clear" onClick={clearDraft}>
          Clear draft
        </button>
      </div>

      <div class="wizard-progress">
        <div class="wizard-progress-labels" role="tablist" aria-label="Progress">
          {STEPS.map((s, i) => (
            <button
              type="button"
              role="tab"
              aria-selected={i === step}
              class={`wizard-progress-label ${i === step ? 'active' : i < step ? 'completed' : ''}`}
              onClick={() => goTo(i)}
              disabled={i > step}
            >
              {i < step ? '✓ ' : ''}{s.label}
            </button>
          ))}
        </div>
        <div class="wizard-segmented" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              class={`wizard-segment ${i < step ? 'complete' : i === step ? 'current' : ''}`}
            />
          ))}
        </div>
      </div>

      <div class="wizard-section-head">
        <span class="wizard-section-count">
          Section {step + 1} of {STEPS.length}
        </span>
        <h2 class="wizard-section-title">{current.title}</h2>
        {current.desc && <p class="wizard-section-desc">{current.desc}</p>}
      </div>

      <div id="wizard-step" class="wizard-step">
        {/* Step 0: Document */}
        {step === 0 && (
          <div>
            {fieldWrap('trustName', (
              <>
                {labelFor('trustName', 'Trust Name *')}
                <input
                  id="trustName"
                  class={inputClass('trustName')}
                  type="text"
                  placeholder="e.g., 123 Main Street Land Trust"
                  value={data.trustName}
                  aria-invalid={!!errorFor('trustName')}
                  onInput={(e: any) => update('trustName', e.target.value)}
                />
                <p class="wizard-field-note">
                  The full legal name of the land trust as it will appear in the trust agreement.
                </p>
              </>
            ))}
          </div>
        )}

        {/* Step 1: Trustee */}
        {step === 1 && (
          <div>
            {fieldWrap('trusteeName', (
              <>
                {labelFor('trusteeName', 'Trustee name *')}
                <input
                  id="trusteeName"
                  class={inputClass('trusteeName')}
                  type="text"
                  placeholder="e.g., Land Trust Services LLC"
                  value={data.trusteeName}
                  aria-invalid={!!errorFor('trusteeName')}
                  onInput={(e: any) => update('trusteeName', e.target.value)}
                />
                <p class="wizard-field-note">
                  The trustee holds legal title to the property. Their name appears on public records.
                </p>
              </>
            ))}

            {fieldWrap('trusteeAddress', (
              <>
                {labelFor('trusteeAddress', 'Trustee address *')}
                <textarea
                  id="trusteeAddress"
                  class={`wizard-textarea${errorFor('trusteeAddress') ? ' wizard-input--invalid' : ''}`}
                  rows={3}
                  placeholder="Street, City, State, ZIP"
                  value={data.trusteeAddress}
                  aria-invalid={!!errorFor('trusteeAddress')}
                  onInput={(e: any) => update('trusteeAddress', e.target.value)}
                />
              </>
            ))}
          </div>
        )}

        {/* Step 2: Beneficiary */}
        {step === 2 && (
          <div>
            {fieldWrap('beneficiaryName', (
              <>
                {labelFor('beneficiaryName', 'Beneficiary name *')}
                <input
                  id="beneficiaryName"
                  class={inputClass('beneficiaryName')}
                  type="text"
                  placeholder="e.g., John J. Smith"
                  value={data.beneficiaryName}
                  aria-invalid={!!errorFor('beneficiaryName')}
                  onInput={(e: any) => update('beneficiaryName', e.target.value)}
                />
                <p class="wizard-field-note">
                  The beneficiary holds the beneficial interest — the real owner. Their name stays private.
                </p>
              </>
            ))}

            {fieldWrap('beneficiaryAddress', (
              <>
                {labelFor('beneficiaryAddress', 'Beneficiary address *')}
                <textarea
                  id="beneficiaryAddress"
                  class={`wizard-textarea${errorFor('beneficiaryAddress') ? ' wizard-input--invalid' : ''}`}
                  rows={3}
                  placeholder="Street, City, State, ZIP"
                  value={data.beneficiaryAddress}
                  aria-invalid={!!errorFor('beneficiaryAddress')}
                  onInput={(e: any) => update('beneficiaryAddress', e.target.value)}
                />
              </>
            ))}
          </div>
        )}

        {/* Step 3: Property */}
        {step === 3 && (
          <div>
            {fieldWrap('propertyDescription', (
              <>
                {labelFor('propertyDescription', 'Legal description *')}
                <textarea
                  id="propertyDescription"
                  class={`wizard-textarea${errorFor('propertyDescription') ? ' wizard-input--invalid' : ''}`}
                  rows={4}
                  placeholder="e.g., Lot 12, Block 7, Sunset Acres Subdivision, according to the plat thereof recorded in Plat Book 42, Page 88"
                  value={data.propertyDescription}
                  aria-invalid={!!errorFor('propertyDescription')}
                  onInput={(e: any) => update('propertyDescription', e.target.value)}
                />
                <p class="wizard-field-note">
                  The legal description from the deed or property tax notice. Not the street address — the formal legal description.
                </p>
              </>
            ))}

            {fieldWrap('propertyAddress', (
              <>
                {labelFor('propertyAddress', 'Property address *')}
                <textarea
                  id="propertyAddress"
                  class={`wizard-textarea${errorFor('propertyAddress') ? ' wizard-input--invalid' : ''}`}
                  rows={2}
                  placeholder="Street, City, State, ZIP"
                  value={data.propertyAddress}
                  aria-invalid={!!errorFor('propertyAddress')}
                  onInput={(e: any) => update('propertyAddress', e.target.value)}
                />
              </>
            ))}
          </div>
        )}

        {/* Step 4: State */}
        {step === 4 && (
          <div>
            {fieldWrap('governingState', (
              <>
                {labelFor('governingState', 'Governing state *')}
                <select
                  id="governingState"
                  class={`wizard-select${errorFor('governingState') ? ' wizard-input--invalid' : ''}`}
                  value={data.governingState}
                  aria-invalid={!!errorFor('governingState')}
                  onChange={(e: any) => update('governingState', e.target.value)}
                >
                  <option value="">Select a state</option>
                  {LAND_TRUST_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <p class="wizard-field-note">
                  Land trusts are recognized in Illinois, Florida, Indiana, North Dakota, Virginia, Ohio, and Georgia. If your state is not listed, consult an attorney about alternatives.
                </p>
              </>
            ))}
          </div>
        )}

        {/* Step 5: Term & Succession */}
        {step === 5 && (
          <div>
            {fieldWrap('trustTerm', (
              <>
                <span class="wizard-label">How long will the trust last? *</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="trustTerm" value="life" checked={data.trustTerm === 'life'}
                      onChange={(e: any) => update('trustTerm', e.target.value)} />
                    Lifetime of beneficiary
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="trustTerm" value="fixed" checked={data.trustTerm === 'fixed'}
                      onChange={(e: any) => update('trustTerm', e.target.value)} />
                    Fixed term
                  </label>
                </div>
              </>
            ))}

            {data.trustTerm === 'fixed' && (
              fieldWrap('fixedTerm', (
                <>
                  {labelFor('fixedTerm', 'Fixed term (e.g., 20 years) *')}
                  <input
                    id="fixedTerm"
                    class={inputClass('fixedTerm')}
                    type="text"
                    placeholder="e.g., 20 years"
                    value={data.fixedTerm}
                    aria-invalid={!!errorFor('fixedTerm')}
                    onInput={(e: any) => update('fixedTerm', e.target.value)}
                  />
                </>
              ))
            )}

            {fieldWrap('successorBeneficiary', (
              <>
                {labelFor('successorBeneficiary', 'Successor beneficiary *')}
                <input
                  id="successorBeneficiary"
                  class={inputClass('successorBeneficiary')}
                  type="text"
                  placeholder="e.g., Jane A. Smith"
                  value={data.successorBeneficiary}
                  aria-invalid={!!errorFor('successorBeneficiary')}
                  onInput={(e: any) => update('successorBeneficiary', e.target.value)}
                />
                <p class="wizard-field-note">
                  Who receives the beneficial interest upon the death of the beneficiary. This passes without probate.
                </p>
              </>
            ))}

            {fieldWrap('trusteeCompensation', (
              <>
                <span class="wizard-label">Trustee compensation *</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="trusteeCompensation" value="no" checked={data.trusteeCompensation === 'no'}
                      onChange={(e: any) => update('trusteeCompensation', e.target.value)} />
                    No compensation
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="trusteeCompensation" value="reasonable" checked={data.trusteeCompensation === 'reasonable'}
                      onChange={(e: any) => update('trusteeCompensation', e.target.value)} />
                    Reasonable compensation
                  </label>
                </div>
              </>
            ))}
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div class="wizard-review">
            {reviewGroups.map((g) => (
              <div class="wizard-review-group" key={g.title}>
                <div class="wizard-review-group-head">
                  <strong>{g.title}</strong>
                  <button type="button" class="wizard-review-edit" onClick={() => goTo(g.step)}>
                    Edit
                  </button>
                </div>
                <dl class="wizard-review-rows">
                  {g.rows
                    .filter((r) => typeof r.v === 'string' && r.v.trim() !== '')
                    .map((r) => (
                      <div class="wizard-review-row" key={r.k}>
                        <dt>{r.k}</dt>
                        <dd>{fmt(r.v)}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}

            <div class="wizard-field">
              <div class={`wizard-checkbox${errorFor('ackDisclaim') ? ' wizard-checkbox--invalid' : ''}`}>
                <input type="checkbox" id="ackDisclaim" checked={data.ackDisclaim}
                  onChange={(e: any) => update('ackDisclaim', e.target.checked)} />
                <label for="ackDisclaim">
                  I understand this is not legal advice and I should consult a licensed attorney.
                  I verify that the information above is accurate to the best of my knowledge.
                </label>
              </div>
              {errorFor('ackDisclaim') && <span class="wizard-error" role="alert">{errorFor('ackDisclaim')}</span>}
            </div>
          </div>
        )}

        {/* Step 7: Download */}
        {step === 7 && (
          <div class="download-success">
            {generated ? (
              <>
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3>Your PDF has been downloaded</h3>
                <p style="color: var(--color-text-muted);">
                  Check your downloads folder for the Land Trust Agreement PDF.
                  The file was generated entirely in your browser — your data was never sent to any server.
                </p>
                <div class="wizard-download-actions">
                  <button class="btn btn-outline" onClick={() => goTo(6)}>Review my answers</button>
                  <button class="btn btn-primary" onClick={handleGenerate}>Download again</button>
                </div>
                <div class="cross-link-card">
                  <h4>Next step: Keep your trust records organized</h4>
                  <p>
                    Your land trust is created — now maintain it. TrustMinutes helps you track meetings,
                    resolutions, and important dates. Free to use.
                  </p>
                  <a href="https://trustminutes.app?utm_source=freetrustdocs&utm_medium=referral&utm_campaign=funnel&utm_content=download_success&utm_term=land_trust"
                     class="btn btn-primary" style="margin-top: 1rem;">
                    Try TrustMinutes (Free) →
                  </a>
                </div>
              </>
            ) : (
              <>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
                  Your answers are ready. Click below to generate your Land Trust Agreement PDF —
                  the PDF is created in your browser, and no data leaves your device.
                </p>
                <button class="btn btn-primary" onClick={handleGenerate} style="font-size: 1.1rem; padding: 0.75rem 2rem;">
                  Generate & Download PDF →
                </button>
                <p class="wizard-download-note">
                  Review the document before sharing or signing it.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {step < 7 && (
        <div class="wizard-nav">
          {step > 0 && (
            <button class="btn btn-outline" onClick={prev}>← Back</button>
          )}
          {step < 6 && (
            <button
              class="btn btn-primary wizard-continue"
              onClick={next}
              aria-label={current.cont}
            >
              {current.cont} →
            </button>
          )}
          {step === 6 && (
            <button class="btn btn-primary wizard-continue" onClick={next}>
              {current.cont} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}