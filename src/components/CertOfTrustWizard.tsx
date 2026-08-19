import { useState, useCallback, useEffect } from 'preact/hooks';
import CertificatePreview from './CertificatePreview';

// ============ Types ============
export interface FormData {
  trustName: string;
  dateExecuted: string;
  settlorName: string;
  trusteeName: string;
  trusteeAddress: string;
  revocability: 'revocable' | 'irrevocable' | '';
  powerToRevoke: string;
  governingState: string;
  trustTaxId: string;
  trusteePowers: 'general' | 'specific' | '';
  specificPowers: string;
  coTrustees: 'sole' | 'multiple' | '';
  coTrusteeAuthority: 'all' | 'less' | '';
  mannerOfTitle: string;
  includeNotary: 'yes' | 'no' | '';
  ackDisclaim: boolean;
}

const initialData: FormData = {
  trustName: '',
  dateExecuted: '',
  settlorName: '',
  trusteeName: '',
  trusteeAddress: '',
  revocability: '',
  powerToRevoke: '',
  governingState: '',
  trustTaxId: '',
  trusteePowers: '',
  specificPowers: '',
  coTrustees: '',
  coTrusteeAuthority: '',
  mannerOfTitle: '',
  includeNotary: 'yes',
  ackDisclaim: false,
};

const STORAGE_KEY = 'freetrustdocs.certificate-of-trust.draft.v2';

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
    desc: 'Identify the trust this certificate will certify.',
    cont: 'Continue to settlor',
  },
  {
    label: 'Settlor',
    title: 'Who is the settlor?',
    desc: 'The settlor is the person who created the trust.',
    cont: 'Continue to trustee',
  },
  {
    label: 'Trustee',
    title: 'Who is the trustee?',
    desc: 'The trustee is the person currently authorized to act on behalf of the trust.',
    cont: 'Continue to trust details',
  },
  {
    label: 'Revocability',
    title: 'Revocability',
    cont: 'Continue to powers & tax ID',
  },
  {
    label: 'Powers & ID',
    title: 'Trustee powers & tax ID',
    cont: 'Continue to title & state',
  },
  {
    label: 'Title & State',
    title: 'Title & governing law',
    cont: 'Review my answers',
  },
  {
    label: 'Review',
    title: 'Review your information',
    desc: 'Confirm everything below, then continue to download.',
    cont: 'Continue to download',
  },
  {
    label: 'Download',
    title: 'Generate your PDF',
    cont: '',
  },
];

const STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
  'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey',
  'New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon',
  'Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah',
  'Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming',
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
      if (!data.dateExecuted) errors.dateExecuted = 'Select the date the trust was executed.';
      break;
    case 1:
      if (!data.settlorName.trim()) errors.settlorName = 'Enter the settlor name(s).';
      break;
    case 2:
      if (!data.trusteeName.trim()) errors.trusteeName = 'Enter the trustee name(s).';
      if (!data.trusteeAddress.trim()) errors.trusteeAddress = 'Enter the trustee address.';
      if (data.coTrustees === 'multiple' && !data.coTrusteeAuthority) {
        errors.coTrusteeAuthority = 'Choose the signing authority for multiple trustees.';
      }
      break;
    case 3:
      if (!data.revocability) errors.revocability = 'Choose revocable or irrevocable.';
      else if (data.revocability === 'revocable' && !data.powerToRevoke.trim()) {
        errors.powerToRevoke = 'Enter who holds the power to revoke.';
      }
      break;
    case 4:
      if (!data.trusteePowers) errors.trusteePowers = 'Choose general or specific powers.';
      else if (data.trusteePowers === 'specific' && !data.specificPowers.trim()) {
        errors.specificPowers = 'Describe the specific powers.';
      }
      if (!data.trustTaxId.trim()) errors.trustTaxId = 'Enter the trust tax ID.';
      break;
    case 5:
      if (!data.governingState) errors.governingState = 'Select a governing state.';
      if (!data.mannerOfTitle.trim()) errors.mannerOfTitle = 'Enter the manner of taking title.';
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
  // @ts-ignore - pdfmake is loaded via script tag
  const pdfMake = (window as any).pdfMake;

  const formatDate = (d: string) => {
    if (!d) return '________________';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const revocabilityText = data.revocability === 'revocable'
    ? `The trust is REVOCABLE. The power to revoke is held by: ${data.powerToRevoke || 'the settlor(s).'}.`
    : data.revocability === 'irrevocable'
    ? 'The trust is IRREVOCABLE and may not be revoked or amended by any person.'
    : 'The revocability status of the trust is: ________________';

  const coTrusteeText = data.coTrustees === 'multiple'
    ? data.coTrusteeAuthority === 'all'
      ? 'Multiple trustees are acting. ALL trustees must sign or act jointly to exercise the powers of the trustee.'
      : 'Multiple trustees are acting. FEWER THAN ALL trustees may exercise the powers of the trustee. The number required to act is: ________________.'
    : 'The currently acting trustee is the sole trustee.';

  const powersText = data.trusteePowers === 'general'
    ? 'The trustee has general powers as provided in the trust instrument, including the power to buy, sell, mortgage, lease, and transfer real and personal property, to open and maintain bank and investment accounts, to borrow and lend funds, to invest and reinvest trust assets, and to execute any documents necessary to administer the trust.'
    : `The trustee has the following specific powers: ${data.specificPowers || '________________'}`;

  const titleText = data.mannerOfTitle || 'Trust property shall be titled in the name of the trustee, as trustee of the trust, as follows: [Trustee Name], Trustee of the [Trust Name] dated [Date].';

  const notaryBlock = data.includeNotary === 'yes' ? [
    { text: '\n\n', fontSize: 10 },
    { text: 'NOTARY ACKNOWLEDGMENT', style: 'sectionHeader', alignment: 'center' },
    { text: '\n', fontSize: 8 },
    {
      text: `State of ${data.governingState || '____________'}\nCounty of ________________\n\nOn this _____ day of ____________, 20____, before me, a Notary Public in and for said State, personally appeared ${data.trusteeName || '________________'}, proved to me through satisfactory evidence to be the person whose name is subscribed above, and acknowledged that they executed the foregoing Certification of Trust as their free and voluntary act and deed for the purposes therein stated.\n\n_______________________________\nNotary Public\nMy Commission Expires: ____________`,
      fontSize: 10,
      lineHeight: 1.5,
    },
  ] : [];

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
      { text: 'CERTIFICATION OF TRUST', style: 'docTitle', alignment: 'center' },
      { text: '\n', fontSize: 8 },

      // Statutory reference
      {
        text: `Pursuant to ${data.governingState || '____________'} law and Uniform Trust Code §1013`,
        style: 'subtitle',
        alignment: 'center',
      },
      { text: '\n\n', fontSize: 10 },

      // Body
      {
        text: `The undersigned trustee hereby certifies the following facts regarding the trust identified below:`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 8 },

      // 1. Trust Name and Existence
      { text: '1. TRUST NAME AND EXISTENCE', style: 'sectionHeader' },
      {
        text: `A trust exists known as the "${data.trustName || '[TRUST NAME]'}" (the "Trust"). The trust instrument was executed on ${formatDate(data.dateExecuted)}.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // 2. Settlor
      { text: '2. SETTLOR(S)', style: 'sectionHeader' },
      {
        text: `The settlor(s) of the Trust is/are: ${data.settlorName || '________________'}.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // 3. Trustee
      { text: '3. CURRENTLY ACTING TRUSTEE(S)', style: 'sectionHeader' },
      {
        text: `The currently acting trustee(s) is/are: ${data.trusteeName || '________________'}, whose address is: ${data.trusteeAddress || '________________'}.\n\n${coTrusteeText}`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // 4. Trustee Powers
      { text: '4. TRUSTEE POWERS', style: 'sectionHeader' },
      { text: powersText, fontSize: 11 },
      { text: '\n', fontSize: 6 },

      // 5. Revocability
      { text: '5. REVOCABILITY', style: 'sectionHeader' },
      { text: revocabilityText, fontSize: 11 },
      { text: '\n', fontSize: 6 },

      // 6. Tax ID
      { text: '6. TAX IDENTIFICATION NUMBER', style: 'sectionHeader' },
      {
        text: `The taxpayer identification number of the Trust is: ${data.trustTaxId || '________________'}.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // 7. Manner of Taking Title
      { text: '7. MANNER OF TAKING TITLE', style: 'sectionHeader' },
      { text: titleText, fontSize: 11 },
      { text: '\n', fontSize: 6 },

      // 8. Statement of Non-Revocation
      { text: '8. STATEMENT OF NON-REVOCATION', style: 'sectionHeader' },
      {
        text: 'The trust has not been revoked, modified, or amended in any manner that would cause the representations contained in this Certification of Trust to be incorrect.',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },

      // Signature
      { text: 'TRUSTEE CERTIFICATION', style: 'sectionHeader' },
      { text: '\n', fontSize: 6 },
      {
        text: 'The undersigned trustee declares under penalty of perjury that the foregoing statements are true and correct and that the trust has not been revoked, modified, or amended in a manner causing the representations herein to be incorrect.',
        fontSize: 10,
      },
      { text: '\n\n', fontSize: 10 },

      // Signature lines
      {
        text: 'Date: ____________________',
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },
      {
        text: '_________________________________\n' +
              `${data.trusteeName || 'Trustee Name'}\n` +
              'Trustee',
        fontSize: 11,
      },

      ...notaryBlock,

      // UPL Disclaimer page
      { text: '\n\n', pageBreak: 'before' as const },
      { text: 'DISCLAIMER', style: 'sectionHeader', alignment: 'center' },
      { text: '\n', fontSize: 8 },
      {
        text: 'This document was generated by FreeTrustDocs.com, a free online trust document generator. FreeTrustDocs.com is not a law firm and does not provide legal advice. This Certification of Trust is a factual certification of information provided by the user and does not constitute legal advice or the practice of law. You should consult a licensed attorney in your jurisdiction before signing or filing any legal document. Use of this tool does not create an attorney-client relationship. FreeTrustDocs.com makes no representation regarding the suitability of this document for any particular purpose or jurisdiction.',
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

  pdfMake.createPdf(docDefinition).download(`Certificate-of-Trust-${data.trustName || 'Document'}.pdf`);
}

// ============ Component ============
export default function CertOfTrustWizard() {
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

  const update = (field: keyof FormData, value: string | boolean) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const goTo = (target: number) => {
    const clamped = Math.max(0, Math.min(target, STEPS.length - 1));
    setStep(clamped);
    setAttempted(false);
    // Keep focus on the new section top.
    requestAnimationFrame(() => {
      const el = document.getElementById('wizard-step');
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const next = () => {
    const errors = validateSection(step, data);
    if (Object.keys(errors).length > 0) {
      setAttempted(true);
      // Focus the first failing field for a calm, in-flow correction.
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
    if (!(window as any).pdfMake) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js';
      script.onload = () => {
        const vfsScript = document.createElement('script');
        vfsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.js';
        vfsScript.onload = () => {
          // Load custom fonts (Crimson Pro + Inter) for PDF consistency with web
          const ftdVfs = document.createElement('script');
          ftdVfs.src = '/fonts/pdf/ftd-vfs.js';
          ftdVfs.onload = () => {
            const vfs = (window as any).pdfMake.vfs;
            if (vfs && (window as any).ftdVFS) {
              Object.assign(vfs, (window as any).ftdVFS);
              (window as any).pdfMake.fonts = {
                CrimsonPro: { normal: 'CrimsonPro.ttf', bold: 'CrimsonPro.ttf', italics: 'CrimsonPro.ttf', bolditalics: 'CrimsonPro.ttf' },
                Inter: { normal: 'Inter.ttf', bold: 'Inter.ttf', italics: 'Inter.ttf', bolditalics: 'Inter.ttf' },
                ...((window as any).pdfMake.fonts || {}),
              };
            }
            generatePDF(data);
            setGenerated(true);
          };
          // If custom fonts fail to load, still generate with default fonts
          ftdVfs.onerror = () => { generatePDF(data); setGenerated(true); };
          document.head.appendChild(ftdVfs);
        };
        document.head.appendChild(vfsScript);
      };
      document.head.appendChild(script);
    } else {
      generatePDF(data);
      setGenerated(true);
    }
  }, [data]);

  const inputClass = (field: string) =>
    `wizard-input${errorFor(field) ? ' wizard-input--invalid' : ''}`;

  const fieldWrap = (field: string, children: any) => (
    <div class="wizard-field">
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
  const reviewGroups = [
    {
      title: 'Document',
      step: 0,
      rows: [
        { k: 'Trust name', v: data.trustName },
        { k: 'Date executed', v: data.dateExecuted },
      ],
    },
    {
      title: 'Settlor',
      step: 1,
      rows: [{ k: 'Settlor name(s)', v: data.settlorName }],
    },
    {
      title: 'Trustee',
      step: 2,
      rows: [
        { k: 'Trustee name(s)', v: data.trusteeName },
        { k: 'Trustee address', v: data.trusteeAddress },
        {
          k: 'Co-trustees',
          v: data.coTrustees === 'multiple' ? 'Multiple trustees' : data.coTrustees ? 'Sole trustee' : '',
        },
        {
          k: 'Signing authority',
          v:
            data.coTrusteeAuthority === 'all'
              ? 'All trustees must sign'
              : data.coTrusteeAuthority === 'less'
              ? 'Fewer than all may act'
              : '',
        },
      ],
    },
    {
      title: 'Revocability',
      step: 3,
      rows: [
        {
          k: 'Revocability',
          v: data.revocability === 'revocable' ? 'Revocable' : data.revocability === 'irrevocable' ? 'Irrevocable' : '',
        },
        ...(data.revocability === 'revocable' ? [{ k: 'Power to revoke', v: data.powerToRevoke }] : []),
      ],
    },
    {
      title: 'Powers & tax ID',
      step: 4,
      rows: [
        {
          k: 'Powers',
          v: data.trusteePowers === 'general' ? 'General' : data.trusteePowers === 'specific' ? 'Specific' : '',
        },
        ...(data.trusteePowers === 'specific' ? [{ k: 'Specific powers', v: data.specificPowers }] : []),
        { k: 'Tax ID', v: data.trustTaxId },
      ],
    },
    {
      title: 'Title & state',
      step: 5,
      rows: [
        { k: 'Governing state', v: data.governingState },
        { k: 'Manner of title', v: data.mannerOfTitle },
        { k: 'Notary block', v: data.includeNotary === 'yes' ? 'Yes' : 'No' },
      ],
    },
  ];

  const current = STEPS[step];

  return (
    <div class="wizard-container wizard-container--preview">
      {/* Persistent browser-save status + draft controls */}
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

      {/* Progress: labeled segments + step counter */}
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

      {/* Section heading */}
      <div class="wizard-layout">
        <div class="wizard-layout-form">
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
                  placeholder="e.g., Smith Family Trust"
                  value={data.trustName}
                  aria-invalid={!!errorFor('trustName')}
                  onInput={(e: any) => update('trustName', e.target.value)}
                />
                <p class="wizard-field-note">
                  The full legal name of the trust as it appears in the trust agreement.
                </p>
              </>
            ))}

            {fieldWrap('dateExecuted', (
              <>
                {labelFor('dateExecuted', 'Date trust was executed *')}
                <input
                  id="dateExecuted"
                  class={inputClass('dateExecuted')}
                  type="date"
                  value={data.dateExecuted}
                  aria-invalid={!!errorFor('dateExecuted')}
                  onInput={(e: any) => update('dateExecuted', e.target.value)}
                />
              </>
            ))}
          </div>
        )}

        {/* Step 1: Settlor */}
        {step === 1 && (
          <div>
            {fieldWrap('settlorName', (
              <>
                {labelFor('settlorName', 'Settlor name(s) *')}
                <input
                  id="settlorName"
                  class={inputClass('settlorName')}
                  type="text"
                  placeholder="e.g., John J. Smith"
                  value={data.settlorName}
                  aria-invalid={!!errorFor('settlorName')}
                  onInput={(e: any) => update('settlorName', e.target.value)}
                />
                <p class="wizard-field-note">
                  The settlor creates the trust and may be the same person as the trustee.
                </p>
              </>
            ))}
          </div>
        )}

        {/* Step 2: Trustee */}
        {step === 2 && (
          <div>
            {fieldWrap('trusteeName', (
              <>
                {labelFor('trusteeName', 'Trustee name(s) *')}
                <input
                  id="trusteeName"
                  class={inputClass('trusteeName')}
                  type="text"
                  placeholder="e.g., John J. Smith"
                  value={data.trusteeName}
                  aria-invalid={!!errorFor('trusteeName')}
                  onInput={(e: any) => update('trusteeName', e.target.value)}
                />
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

            <div class="wizard-field">
              <span class="wizard-label">Are there multiple trustees?</span>
              <div class="wizard-radio-group">
                <label class="wizard-radio-label">
                  <input type="radio" name="coTrustees" value="sole" checked={data.coTrustees === 'sole'}
                    onChange={(e: any) => update('coTrustees', e.target.value)} />
                  Sole trustee
                </label>
                <label class="wizard-radio-label">
                  <input type="radio" name="coTrustees" value="multiple" checked={data.coTrustees === 'multiple'}
                    onChange={(e: any) => update('coTrustees', e.target.value)} />
                  Multiple trustees
                </label>
              </div>
            </div>

            {data.coTrustees === 'multiple' && (
              fieldWrap('coTrusteeAuthority', (
                <>
                  <span class="wizard-label">Signing authority</span>
                  <div class="wizard-radio-group">
                    <label class="wizard-radio-label">
                      <input type="radio" name="coAuth" value="all" checked={data.coTrusteeAuthority === 'all'}
                        onChange={(e: any) => update('coTrusteeAuthority', e.target.value)} />
                      All trustees must sign
                    </label>
                    <label class="wizard-radio-label">
                      <input type="radio" name="coAuth" value="less" checked={data.coTrusteeAuthority === 'less'}
                        onChange={(e: any) => update('coTrusteeAuthority', e.target.value)} />
                      Fewer than all may act
                    </label>
                  </div>
                </>
              ))
            )}
          </div>
        )}

        {/* Step 3: Revocability */}
        {step === 3 && (
          <div>
            {fieldWrap('revocability', (
              <>
                <span class="wizard-label">Is the trust revocable or irrevocable? *</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="revocability" value="revocable" checked={data.revocability === 'revocable'}
                      onChange={(e: any) => update('revocability', e.target.value)} />
                    Revocable
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="revocability" value="irrevocable" checked={data.revocability === 'irrevocable'}
                      onChange={(e: any) => update('revocability', e.target.value)} />
                    Irrevocable
                  </label>
                </div>
              </>
            ))}

            {data.revocability === 'revocable' && (
              fieldWrap('powerToRevoke', (
                <>
                  {labelFor('powerToRevoke', 'Who holds the power to revoke? *')}
                  <input
                    id="powerToRevoke"
                    class={inputClass('powerToRevoke')}
                    type="text"
                    placeholder="e.g., John J. Smith (the settlor)"
                    value={data.powerToRevoke}
                    aria-invalid={!!errorFor('powerToRevoke')}
                    onInput={(e: any) => update('powerToRevoke', e.target.value)}
                  />
                </>
              ))
            )}
          </div>
        )}

        {/* Step 4: Powers & Tax ID */}
        {step === 4 && (
          <div>
            {fieldWrap('trusteePowers', (
              <>
                <span class="wizard-label">What powers should be certified? *</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="powers" value="general" checked={data.trusteePowers === 'general'}
                      onChange={(e: any) => update('trusteePowers', e.target.value)} />
                    General powers (recommended for most cases)
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="powers" value="specific" checked={data.trusteePowers === 'specific'}
                      onChange={(e: any) => update('trusteePowers', e.target.value)} />
                    Specific powers only
                  </label>
                </div>
              </>
            ))}

            {data.trusteePowers === 'specific' && (
              fieldWrap('specificPowers', (
                <>
                  {labelFor('specificPowers', 'Describe the specific powers *')}
                  <textarea
                    id="specificPowers"
                    class={`wizard-textarea${errorFor('specificPowers') ? ' wizard-input--invalid' : ''}`}
                    rows={3}
                    placeholder="e.g., to sell real property at 123 Main St and deposit proceeds into trust account"
                    value={data.specificPowers}
                    aria-invalid={!!errorFor('specificPowers')}
                    onInput={(e: any) => update('specificPowers', e.target.value)}
                  />
                </>
              ))
            )}

            {fieldWrap('trustTaxId', (
              <>
                {labelFor('trustTaxId', 'Trust tax ID (SSN or EIN) *')}
                <input
                  id="trustTaxId"
                  class={inputClass('trustTaxId')}
                  type="text"
                  placeholder="e.g., 123-45-6789 or XX-XXXXXXX"
                  value={data.trustTaxId}
                  aria-invalid={!!errorFor('trustTaxId')}
                  onInput={(e: any) => update('trustTaxId', e.target.value)}
                />
                <p class="wizard-field-note">
                  The trust's taxpayer identification number. This information stays on your device.
                </p>
              </>
            ))}
          </div>
        )}

        {/* Step 5: Title & State */}
        {step === 5 && (
          <div>
            {fieldWrap('governingState', (
              <>
                {labelFor('governingState', 'Governing law state *')}
                <select
                  id="governingState"
                  class={`wizard-select${errorFor('governingState') ? ' wizard-input--invalid' : ''}`}
                  value={data.governingState}
                  aria-invalid={!!errorFor('governingState')}
                  onChange={(e: any) => update('governingState', e.target.value)}
                >
                  <option value="">Select a state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </>
            ))}

            {fieldWrap('mannerOfTitle', (
              <>
                {labelFor('mannerOfTitle', 'Manner of taking title *')}
                <input
                  id="mannerOfTitle"
                  class={inputClass('mannerOfTitle')}
                  type="text"
                  placeholder="e.g., John J. Smith, Trustee of the Smith Family Trust dated January 1, 2024"
                  value={data.mannerOfTitle}
                  aria-invalid={!!errorFor('mannerOfTitle')}
                  onInput={(e: any) => update('mannerOfTitle', e.target.value)}
                />
                <p class="wizard-field-note">
                  How trust property should be titled in deeds and accounts.
                </p>
              </>
            ))}

            <div class="wizard-field">
              <span class="wizard-label">Include notary acknowledgment?</span>
              <div class="wizard-radio-group">
                <label class="wizard-radio-label">
                  <input type="radio" name="notary" value="yes" checked={data.includeNotary === 'yes'}
                    onChange={(e: any) => update('includeNotary', e.target.value)} />
                  Yes, include notary block (recommended)
                </label>
                <label class="wizard-radio-label">
                  <input type="radio" name="notary" value="no" checked={data.includeNotary === 'no'}
                    onChange={(e: any) => update('includeNotary', e.target.value)} />
                  No, skip notary block
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review — structured groups with in-flow edit links */}
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
                  Check your downloads folder for the Certificate of Trust PDF.
                  The file was generated entirely in your browser — your data was never sent to any server.
                </p>
                <div class="wizard-download-actions">
                  <button class="btn btn-outline" onClick={() => goTo(6)}>Review my answers</button>
                  <button class="btn btn-primary" onClick={handleGenerate}>Download again</button>
                </div>
                <div class="cross-link-card">
                  <h4>Next step: Keep your trust records organized</h4>
                  <p>
                    Your trust is created — now maintain it. TrustMinutes helps you track meetings,
                    resolutions, and important dates. Free to use.
                  </p>
                  <a href="https://trustminutes.app?utm_source=freetrustdocs&utm_medium=referral&utm_campaign=funnel&utm_content=download_success&utm_term=certificate_of_trust"
                     class="btn btn-primary" style="margin-top: 1rem;">
                    Try TrustMinutes (Free) →
                  </a>
                </div>
              </>
            ) : (
              <>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
                  Your answers are ready. Click below to generate your Certificate of Trust PDF —
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

      {/* Navigation — sticky on mobile, stable in place */}
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

        <CertificatePreview data={data} />
      </div>
    </div>
  );
}
