import { useState, useCallback, useEffect } from 'preact/hooks';

// ============ Types ============
interface FormData {
  trustName: string;
  trustPurpose: string;
  settlorName: string;
  settlorAddress: string;
  trusteeName: string;
  trusteeAddress: string;
  grantorAlsoTrustee: 'yes' | 'no' | '';
  beneficiaryNames: string;
  beneficiaryAddress: string;
  revocability: 'revocable' | 'irrevocable' | '';
  powerToRevoke: string;
  trustProperty: string;
  duration: 'life' | 'fixed' | 'perpetual' | '';
  fixedTerm: string;
  distributionPolicy: 'mandatory' | 'discretionary' | 'accumulation' | '';
  governingState: string;
  trustType: 'common' | 'statutory' | '';
  trusteeCompensation: 'no' | 'reasonable' | 'fixed' | '';
  compensationAmount: string;
  successorTrustee: string;
  includeNotary: 'yes' | 'no' | '';
  ackDisclaim: boolean;
}

const initialData: FormData = {
  trustName: '',
  trustPurpose: '',
  settlorName: '',
  settlorAddress: '',
  trusteeName: '',
  trusteeAddress: '',
  grantorAlsoTrustee: '',
  beneficiaryNames: '',
  beneficiaryAddress: '',
  revocability: '',
  powerToRevoke: '',
  trustProperty: '',
  duration: '',
  fixedTerm: '',
  distributionPolicy: '',
  governingState: '',
  trustType: '',
  trusteeCompensation: '',
  compensationAmount: '',
  successorTrustee: '',
  includeNotary: 'yes',
  ackDisclaim: false,
};

const STORAGE_KEY = 'freetrustdocs.declaration-of-trust.draft.v1';

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
    desc: 'Identify the trust this declaration will establish.',
    cont: 'Continue to settlor',
  },
  {
    label: 'Settlor',
    title: 'Who is the settlor?',
    desc: 'The settlor (also called grantor or trustor) creates the trust and transfers assets into it.',
    cont: 'Continue to trustee',
  },
  {
    label: 'Trustee',
    title: 'Who is the trustee?',
    desc: 'The trustee holds legal title to trust assets and administers them for the beneficiaries.',
    cont: 'Continue to beneficiaries',
  },
  {
    label: 'Beneficiaries',
    title: 'Who are the beneficiaries?',
    desc: 'Beneficiaries are the persons or entities entitled to benefit from the trust property.',
    cont: 'Continue to revocability',
  },
  {
    label: 'Revocability',
    title: 'Revocable or irrevocable?',
    cont: 'Continue to property & term',
  },
  {
    label: 'Property & Term',
    title: 'Trust property & duration',
    cont: 'Continue to law & administration',
  },
  {
    label: 'Law & Admin',
    title: 'Governing law & administration',
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
      break;
    case 1:
      if (!data.settlorName.trim()) errors.settlorName = 'Enter the settlor name(s).';
      if (!data.settlorAddress.trim()) errors.settlorAddress = 'Enter the settlor address.';
      break;
    case 2:
      if (!data.trusteeName.trim()) errors.trusteeName = 'Enter the trustee name(s).';
      if (!data.trusteeAddress.trim()) errors.trusteeAddress = 'Enter the trustee address.';
      break;
    case 3:
      if (!data.beneficiaryNames.trim()) errors.beneficiaryNames = 'Enter the beneficiary name(s).';
      break;
    case 4:
      if (!data.revocability) errors.revocability = 'Choose revocable or irrevocable.';
      else if (data.revocability === 'revocable' && !data.powerToRevoke.trim()) {
        errors.powerToRevoke = 'Enter who holds the power to revoke.';
      }
      break;
    case 5:
      if (!data.trustProperty.trim()) errors.trustProperty = 'Describe the trust property.';
      if (!data.duration) errors.duration = 'Choose the trust duration.';
      else if (data.duration === 'fixed' && !data.fixedTerm.trim()) {
        errors.fixedTerm = 'Enter the fixed term.';
      }
      break;
    case 6:
      if (!data.governingState) errors.governingState = 'Select a governing state.';
      if (!data.trusteeCompensation) errors.trusteeCompensation = 'Choose a compensation option.';
      else if (data.trusteeCompensation === 'fixed' && !data.compensationAmount.trim()) {
        errors.compensationAmount = 'Enter the compensation amount.';
      }
      break;
    case 7:
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

  const revocabilityText =
    data.revocability === 'revocable'
      ? `This Declaration of Trust is REVOCABLE. The power to revoke or amend this trust is held by: ${data.powerToRevoke || 'the settlor(s).'}`
      : 'This Declaration of Trust is IRREVOCABLE and may not be revoked or amended by any person without the consent of the beneficiaries or as otherwise provided by law.';

  const durationText =
    data.duration === 'fixed'
      ? `The trust shall continue for a fixed term of ${data.fixedTerm || '________________'}.`
      : data.duration === 'perpetual'
      ? 'The trust shall continue in perpetuity, subject to any applicable rule against perpetuities and other applicable law.'
      : 'The trust shall continue during the lifetime of the named beneficiary(ies), unless sooner terminated in accordance with this Declaration of Trust.';

  const trustTypeText =
    data.trustType === 'statutory'
      ? 'The Trustee is authorized to file any certificate or statement required or permitted by applicable law to evidence the existence of this trust.'
      : 'This trust is intended to operate as a common-law trust without any filing with a governmental authority, except as required by applicable law.';

  const compensationText =
    data.trusteeCompensation === 'reasonable'
      ? 'The Trustee shall be entitled to reasonable compensation for services rendered, as agreed between the Trustee and the Settlor or as determined in accordance with applicable law.'
      : data.trusteeCompensation === 'fixed'
      ? `The Trustee shall be entitled to compensation in the amount of ${data.compensationAmount || '________________'}.`
      : 'The Trustee shall serve without compensation.';

  const distributionText =
    data.distributionPolicy === 'mandatory'
      ? 'The Trustee shall make distributions to or for the benefit of the beneficiaries as set forth in this Declaration of Trust without discretion.'
      : data.distributionPolicy === 'accumulation'
      ? 'The Trustee may accumulate income and principal within the trust and distribute at the Trustee\u2019s discretion, subject to the terms of this Declaration of Trust.'
      : 'The Trustee shall have full discretion to distribute income and principal to or for the benefit of the beneficiaries, in such amounts and at such times as the Trustee determines, subject to the terms of this Declaration of Trust.';

  const notaryBlock = data.includeNotary === 'yes' ? [
    { text: '\n\n', fontSize: 10 },
    { text: 'NOTARY ACKNOWLEDGMENT', style: 'sectionHeader', alignment: 'center' },
    { text: '\n', fontSize: 8 },
    {
      text: `State of ${data.governingState || '____________'}\nCounty of ________________\n\nOn this _____ day of ____________, 20____, before me, a Notary Public in and for said State, personally appeared ${data.settlorName || '________________'} and ${data.trusteeName || '________________'}, proved to me through satisfactory evidence to be the persons whose names are subscribed above, and acknowledged that they executed the foregoing Declaration of Trust as their free and voluntary act and deed for the purposes therein stated.\n\n_______________________________\nNotary Public\nMy Commission Expires: ____________`,
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
      { text: 'DECLARATION OF TRUST', style: 'docTitle', alignment: 'center' },
      { text: '\n', fontSize: 8 },
      {
        text: `TRUST AGREEMENT OF ${(data.trustName || '[TRUST NAME]').toUpperCase()}`,
        style: 'subtitle',
        alignment: 'center',
      },
      { text: '\n\n', fontSize: 10 },

      // Preamble
      {
        text: `This Declaration of Trust (this "Trust Agreement") is made and entered into on ${formatDate('')} by and between ${data.settlorName || '[SETTLOR NAME]'} (the "Settlor") and ${data.trusteeName || '[TRUSTEE NAME]'} (the "Trustee").`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },
      {
        text: `WHEREAS, the Settlor desires to create a trust for the benefit of the beneficiaries identified below, and to transfer the trust property described below to the Trustee to be held and administered in accordance with the terms of this Trust Agreement.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },
      {
        text: `NOW, THEREFORE, for good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Settlor declares and the Trustee accepts the trust upon the following terms and conditions:`,
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 8 },

      // Article I
      { text: 'ARTICLE I — NAME AND PURPOSE', style: 'sectionHeader' },
      {
        text: `The trust created by this Trust Agreement shall be known as the "${data.trustName || '[TRUST NAME]'}" (the "Trust"). The purpose of the Trust is: ${data.trustPurpose || 'to hold, manage, invest, and distribute the trust property for the benefit of the beneficiaries as provided in this Trust Agreement.'}`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article II
      { text: 'ARTICLE II — DEFINITIONS', style: 'sectionHeader' },
      {
        text: 'Unless otherwise defined in this Trust Agreement, capitalized terms shall have the meanings set forth in this Article II. "Settlor" means the person who creates and funds the Trust. "Trustee" means the person or persons then acting as trustee of the Trust. "Beneficiary" means the person or entity for whose benefit the Trust is held. "Trust Property" means all property described in Article III and any other property hereafter transferred to the Trust.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article III
      { text: 'ARTICLE III — TRUST PROPERTY', style: 'sectionHeader' },
      {
        text: `The Trust Property consists of the following: ${data.trustProperty || '________________'}. The Settlor shall transfer such property to the Trustee, and the Trustee shall hold, manage, and administer the Trust Property in accordance with the terms of this Trust Agreement. Additional property may be transferred to the Trust at any time by the Settlor or by any other person.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article IV
      { text: 'ARTICLE IV — TRUSTEE POWERS', style: 'sectionHeader' },
      {
        text: `The Trustee shall have all powers granted by applicable law, and in addition shall have the power to buy, sell, exchange, mortgage, lease, and transfer real and personal property; to open and maintain bank and brokerage accounts; to invest and reinvest trust assets; to borrow and lend funds; to collect income; to pay taxes, expenses, and obligations of the Trust; and to execute any documents necessary or convenient to administer the Trust, subject to the terms of this Trust Agreement.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article V
      { text: 'ARTICLE V — TRUSTEE DUTIES', style: 'sectionHeader' },
      {
        text: `The Trustee shall act in accordance with the terms of this Trust Agreement and shall administer the Trust in good faith, in accordance with its purposes and the interests of the beneficiaries. The Trustee shall keep accurate records of all receipts and disbursements and shall provide reports to the beneficiaries as required by applicable law or as reasonably requested.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article VI
      { text: 'ARTICLE VI — BENEFICIARY INTERESTS', style: 'sectionHeader' },
      {
        text: `The beneficiaries of the Trust are: ${data.beneficiaryNames || '________________'}. ${distributionText}`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article VII
      { text: 'ARTICLE VII — ADMINISTRATION', style: 'sectionHeader' },
      {
        text: `The Trust shall be administered by the Trustee in accordance with the terms of this Trust Agreement and applicable law. ${trustTypeText} The principal place of administration shall be the state selected for governing law below, unless the Trustee determines otherwise in accordance with applicable law.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article VIII
      { text: 'ARTICLE VIII — REVOCATION OR AMENDMENT', style: 'sectionHeader' },
      { text: revocabilityText, fontSize: 11 },
      { text: '\n', fontSize: 6 },

      // Article IX
      { text: 'ARTICLE IX — DURATION AND DISSOLUTION', style: 'sectionHeader' },
      {
        text: `${durationText} The Trustee may terminate and wind up the Trust upon the termination date set forth above, or earlier if the Trustee determines that the purposes of the Trust have been fulfilled or are impossible to fulfill, subject to applicable law.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article X
      { text: 'ARTICLE X — SUCCESSOR TRUSTEE', style: 'sectionHeader' },
      {
        text: data.successorTrustee && data.successorTrustee.trim()
          ? `If the Trustee is unable or unwilling to serve, or resigns or is removed, the following shall serve as successor trustee: ${data.successorTrustee}.`
          : 'If the Trustee is unable or unwilling to serve, or resigns or is removed, the Settlor may appoint a successor trustee in writing. In the event the Settlor is unable to act, a successor trustee may be appointed in accordance with applicable law.',
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article XI
      { text: 'ARTICLE XI — GOVERNING LAW', style: 'sectionHeader' },
      {
        text: `This Trust Agreement and the administration of the Trust shall be governed by and construed in accordance with the laws of the State of ${data.governingState || '________________'}, without regard to its conflicts of law principles.`,
        fontSize: 11,
      },
      { text: '\n', fontSize: 6 },

      // Article XII
      { text: 'ARTICLE XII — MISCELLANEOUS', style: 'sectionHeader' },
      {
        text: `If any provision of this Trust Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect. This Trust Agreement may be executed in counterparts. The headings in this Trust Agreement are for convenience only and shall not affect its interpretation. ${compensationText}`,
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },

      // Execution
      { text: 'EXECUTION', style: 'sectionHeader' },
      {
        text: `IN WITNESS WHEREOF, the parties have executed this Declaration of Trust as of the date first written above.`,
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },

      {
        text: `Date: ____________________`,
        fontSize: 11,
      },
      { text: '\n\n', fontSize: 10 },

      // Settlor signature
      {
        text: '_________________________________\n' +
              `${data.settlorName || 'Settlor Name'}\n` +
              'Settlor',
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
        text: 'This document was generated by FreeTrustDocs.com, a free online trust document generator. FreeTrustDocs.com is not a law firm and does not provide legal advice. This Declaration of Trust is a template assembled from information provided by the user and does not constitute legal advice or the practice of law. You should consult a licensed attorney in your jurisdiction before signing or filing any legal document. Use of this tool does not create an attorney-client relationship. This document does not guarantee any specific tax, asset-protection, or legal outcome, which depend on state law, how the trust is funded, and how it is administered. FreeTrustDocs.com makes no representation regarding the suitability of this document for any particular purpose or jurisdiction.',
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

  pdfMake.createPdf(docDefinition).download(`Declaration-of-Trust-${data.trustName || 'Document'}.pdf`);
}

// ============ Component ============
export default function DeclarationOfTrustWizard() {
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

  const revocabilityLabel = data.revocability === 'revocable' ? 'Revocable' : data.revocability === 'irrevocable' ? 'Irrevocable' : '';
  const durationLabel = data.duration === 'fixed' ? `Fixed term (${data.fixedTerm})` : data.duration === 'perpetual' ? 'Perpetual' : data.duration === 'life' ? 'Until beneficiary death' : '';

  const reviewGroups = [
    {
      title: 'Document',
      step: 0,
      rows: [
        { k: 'Trust name', v: data.trustName },
        { k: 'Purpose', v: data.trustPurpose },
      ],
    },
    {
      title: 'Settlor',
      step: 1,
      rows: [
        { k: 'Settlor name(s)', v: data.settlorName },
        { k: 'Settlor address', v: data.settlorAddress },
      ],
    },
    {
      title: 'Trustee',
      step: 2,
      rows: [
        { k: 'Trustee name(s)', v: data.trusteeName },
        { k: 'Trustee address', v: data.trusteeAddress },
        { k: 'Settlor also trustee', v: data.grantorAlsoTrustee === 'yes' ? 'Yes' : data.grantorAlsoTrustee === 'no' ? 'No' : '' },
      ],
    },
    {
      title: 'Beneficiaries',
      step: 3,
      rows: [
        { k: 'Beneficiary name(s)', v: data.beneficiaryNames },
        { k: 'Beneficiary address', v: data.beneficiaryAddress },
      ],
    },
    {
      title: 'Revocability',
      step: 4,
      rows: [
        { k: 'Revocability', v: revocabilityLabel },
        ...(data.revocability === 'revocable' ? [{ k: 'Power to revoke', v: data.powerToRevoke }] : []),
      ],
    },
    {
      title: 'Property & term',
      step: 5,
      rows: [
        { k: 'Trust property', v: data.trustProperty },
        { k: 'Duration', v: durationLabel },
      ],
    },
    {
      title: 'Law & administration',
      step: 6,
      rows: [
        { k: 'Governing state', v: data.governingState },
        { k: 'Trust type', v: data.trustType === 'common' ? 'Common-law trust' : data.trustType === 'statutory' ? 'Statutory trust' : '' },
        { k: 'Distribution policy', v: data.distributionPolicy === 'mandatory' ? 'Mandatory distributions' : data.distributionPolicy === 'accumulation' ? 'Accumulation' : data.distributionPolicy === 'discretionary' ? 'Discretionary' : '' },
        { k: 'Trustee compensation', v: data.trusteeCompensation === 'reasonable' ? 'Reasonable' : data.trusteeCompensation === 'fixed' ? `Fixed (${data.compensationAmount})` : data.trusteeCompensation === 'no' ? 'None' : '' },
        { k: 'Successor trustee', v: data.successorTrustee },
        { k: 'Notary block', v: data.includeNotary === 'yes' ? 'Yes' : 'No' },
      ],
    },
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
                  placeholder="e.g., Smith Family Business Trust"
                  value={data.trustName}
                  aria-invalid={!!errorFor('trustName')}
                  onInput={(e: any) => update('trustName', e.target.value)}
                />
                <p class="wizard-field-note">
                  The full legal name of the trust as it will appear in the trust agreement.
                </p>
              </>
            ))}

            {fieldWrap('trustPurpose', (
              <>
                {labelFor('trustPurpose', 'Purpose (optional)')}
                <textarea
                  id="trustPurpose"
                  class="wizard-textarea"
                  rows={3}
                  placeholder="e.g., to own and manage business assets for the benefit of the beneficiaries"
                  value={data.trustPurpose}
                  onInput={(e: any) => update('trustPurpose', e.target.value)}
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
                  The settlor creates the trust and transfers assets into it. Also called grantor or trustor.
                </p>
              </>
            ))}

            {fieldWrap('settlorAddress', (
              <>
                {labelFor('settlorAddress', 'Settlor address *')}
                <textarea
                  id="settlorAddress"
                  class={`wizard-textarea${errorFor('settlorAddress') ? ' wizard-input--invalid' : ''}`}
                  rows={3}
                  placeholder="Street, City, State, ZIP"
                  value={data.settlorAddress}
                  aria-invalid={!!errorFor('settlorAddress')}
                  onInput={(e: any) => update('settlorAddress', e.target.value)}
                />
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
                <p class="wizard-field-note">
                  The trustee holds legal title to trust assets and administers them for the beneficiaries.
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

            <div class="wizard-field">
              <span class="wizard-label">Does the settlor also serve as trustee?</span>
              <div class="wizard-radio-group">
                <label class="wizard-radio-label">
                  <input type="radio" name="grantorAlsoTrustee" value="yes" checked={data.grantorAlsoTrustee === 'yes'}
                    onChange={(e: any) => update('grantorAlsoTrustee', e.target.value)} />
                  Yes — settlor is also trustee
                </label>
                <label class="wizard-radio-label">
                  <input type="radio" name="grantorAlsoTrustee" value="no" checked={data.grantorAlsoTrustee === 'no'}
                    onChange={(e: any) => update('grantorAlsoTrustee', e.target.value)} />
                  No — independent trustee
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Beneficiaries */}
        {step === 3 && (
          <div>
            {fieldWrap('beneficiaryNames', (
              <>
                {labelFor('beneficiaryNames', 'Beneficiary name(s) *')}
                <textarea
                  id="beneficiaryNames"
                  class={`wizard-textarea${errorFor('beneficiaryNames') ? ' wizard-input--invalid' : ''}`}
                  rows={3}
                  placeholder="e.g., Jane A. Smith, or ABC Holdings LLC"
                  value={data.beneficiaryNames}
                  aria-invalid={!!errorFor('beneficiaryNames')}
                  onInput={(e: any) => update('beneficiaryNames', e.target.value)}
                />
                <p class="wizard-field-note">
                  The person(s) or entities entitled to benefit from the trust property.
                </p>
              </>
            ))}

            {fieldWrap('beneficiaryAddress', (
              <>
                {labelFor('beneficiaryAddress', 'Beneficiary address (optional)')}
                <textarea
                  id="beneficiaryAddress"
                  class="wizard-textarea"
                  rows={2}
                  placeholder="Street, City, State, ZIP"
                  value={data.beneficiaryAddress}
                  onInput={(e: any) => update('beneficiaryAddress', e.target.value)}
                />
              </>
            ))}
          </div>
        )}

        {/* Step 4: Revocability */}
        {step === 4 && (
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

            {fieldWrap('distributionPolicy', (
              <>
                <span class="wizard-label">Distribution policy</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="distributionPolicy" value="discretionary" checked={data.distributionPolicy === 'discretionary'}
                      onChange={(e: any) => update('distributionPolicy', e.target.value)} />
                    Discretionary distributions by trustee
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="distributionPolicy" value="mandatory" checked={data.distributionPolicy === 'mandatory'}
                      onChange={(e: any) => update('distributionPolicy', e.target.value)} />
                    Mandatory regular distributions
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="distributionPolicy" value="accumulation" checked={data.distributionPolicy === 'accumulation'}
                      onChange={(e: any) => update('distributionPolicy', e.target.value)} />
                    Accumulation (income retained in trust)
                  </label>
                </div>
              </>
            ))}
          </div>
        )}

        {/* Step 5: Property & Term */}
        {step === 5 && (
          <div>
            {fieldWrap('trustProperty', (
              <>
                {labelFor('trustProperty', 'Describe the trust property (corpus) *')}
                <textarea
                  id="trustProperty"
                  class={`wizard-textarea${errorFor('trustProperty') ? ' wizard-input--invalid' : ''}`}
                  rows={3}
                  placeholder="e.g., real property at 123 Main St, plus all business assets listed in Exhibit A"
                  value={data.trustProperty}
                  aria-invalid={!!errorFor('trustProperty')}
                  onInput={(e: any) => update('trustProperty', e.target.value)}
                />
                <p class="wizard-field-note">
                  What assets are transferred into the trust. A detailed schedule can be attached as an exhibit.
                </p>
              </>
            ))}

            {fieldWrap('duration', (
              <>
                <span class="wizard-label">How long will the trust last? *</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="duration" value="life" checked={data.duration === 'life'}
                      onChange={(e: any) => update('duration', e.target.value)} />
                    Until beneficiary death
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="duration" value="fixed" checked={data.duration === 'fixed'}
                      onChange={(e: any) => update('duration', e.target.value)} />
                    Fixed term
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="duration" value="perpetual" checked={data.duration === 'perpetual'}
                      onChange={(e: any) => update('duration', e.target.value)} />
                    Perpetual (if state law allows)
                  </label>
                </div>
              </>
            ))}

            {data.duration === 'fixed' && (
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
          </div>
        )}

        {/* Step 6: Law & Administration */}
        {step === 6 && (
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

            {fieldWrap('trustType', (
              <>
                <span class="wizard-label">How will the trust be established?</span>
                <div class="wizard-radio-group">
                  <label class="wizard-radio-label">
                    <input type="radio" name="trustType" value="common" checked={data.trustType === 'common'}
                      onChange={(e: any) => update('trustType', e.target.value)} />
                    Common-law trust (no state filing)
                  </label>
                  <label class="wizard-radio-label">
                    <input type="radio" name="trustType" value="statutory" checked={data.trustType === 'statutory'}
                      onChange={(e: any) => update('trustType', e.target.value)} />
                    Statutory trust (filing may be required)
                  </label>
                </div>
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
                  <label class="wizard-radio-label">
                    <input type="radio" name="trusteeCompensation" value="fixed" checked={data.trusteeCompensation === 'fixed'}
                      onChange={(e: any) => update('trusteeCompensation', e.target.value)} />
                    Fixed amount
                  </label>
                </div>
              </>
            ))}

            {data.trusteeCompensation === 'fixed' && (
              fieldWrap('compensationAmount', (
                <>
                  {labelFor('compensationAmount', 'Compensation amount *')}
                  <input
                    id="compensationAmount"
                    class={inputClass('compensationAmount')}
                    type="text"
                    placeholder="e.g., $5,000 per year"
                    value={data.compensationAmount}
                    aria-invalid={!!errorFor('compensationAmount')}
                    onInput={(e: any) => update('compensationAmount', e.target.value)}
                  />
                </>
              ))
            )}

            {fieldWrap('successorTrustee', (
              <>
                {labelFor('successorTrustee', 'Successor trustee (optional)')}
                <input
                  id="successorTrustee"
                  class={inputClass('successorTrustee')}
                  type="text"
                  placeholder="e.g., Jane A. Smith"
                  value={data.successorTrustee}
                  onInput={(e: any) => update('successorTrustee', e.target.value)}
                />
                <p class="wizard-field-note">
                  Who will serve if the current trustee resigns, is removed, or becomes unable to act.
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

        {/* Step 7: Review */}
        {step === 7 && (
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

        {/* Step 8: Download */}
        {step === 8 && (
          <div class="download-success">
            {generated ? (
              <>
                <svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3>Your PDF has been downloaded</h3>
                <p style="color: var(--color-text-muted);">
                  Check your downloads folder for the Declaration of Trust PDF.
                  The file was generated entirely in your browser — your data was never sent to any server.
                </p>
                <div class="wizard-download-actions">
                  <button class="btn btn-outline" onClick={() => goTo(7)}>Review my answers</button>
                  <button class="btn btn-primary" onClick={handleGenerate}>Download again</button>
                </div>
                <div class="cross-link-card">
                  <h4>Next step: Keep your trust records organized</h4>
                  <p>
                    Your trust is created — now maintain it. TrustMinutes helps you track meetings,
                    resolutions, and important dates. Free to use.
                  </p>
                  <a href="https://trustminutes.app?utm_source=freetrustdocs&utm_medium=referral&utm_campaign=funnel&utm_content=download_success&utm_term=declaration_of_trust"
                     class="btn btn-primary" style="margin-top: 1rem;">
                    Try TrustMinutes (Free) →
                  </a>
                </div>
              </>
            ) : (
              <>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
                  Your answers are ready. Click below to generate your Declaration of Trust PDF —
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

      {step < 8 && (
        <div class="wizard-nav">
          {step > 0 && (
            <button class="btn btn-outline" onClick={prev}>← Back</button>
          )}
          {step < 7 && (
            <button
              class="btn btn-primary wizard-continue"
              onClick={next}
              aria-label={current.cont}
            >
              {current.cont} →
            </button>
          )}
          {step === 7 && (
            <button class="btn btn-primary wizard-continue" onClick={next}>
              {current.cont} →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
