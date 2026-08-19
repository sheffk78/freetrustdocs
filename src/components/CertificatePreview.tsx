import { useEffect, useState } from 'preact/hooks';
import type { FormData } from './CertOfTrustWizard';

const NOT_ENTERED = 'Not entered yet';

interface Row {
  label: string;
  value: string | null;
}

/**
 * Live document-sheet preview for the Certificate of Trust wizard.
 *
 * Shows a factual summary of what will appear in the generated PDF, driven
 * entirely by the current form data. Fields the user has not filled in yet are
 * rendered honestly as "Not entered yet" — never invented. It is a summary
 * sheet only: it contains no legal boilerplate, no clause text, and no advice.
 *
 * Layout: on wide screens it is a sticky sidebar beside the form (the form
 * keeps its full usable width in a layout grid); on narrow screens it collapses
 * into a compact <details> disclosure that never blocks form progress.
 */
export default function CertificatePreview({ data }: { data: FormData }) {
  const [open, setOpen] = useState(false);

  // Desktop shows the sheet by default; mobile starts collapsed to a compact
  // summary bar. Track the breakpoint so the sheet always matches the layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const apply = (m: MediaQueryList | MediaQueryListEvent) => setOpen(m.matches);
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const fmtDate = (d: string): string | null => {
    if (!d) return null;
    const dt = new Date(`${d}T00:00:00`);
    if (Number.isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const revocability =
    data.revocability === 'revocable'
      ? 'Revocable'
      : data.revocability === 'irrevocable'
        ? 'Irrevocable'
        : null;

  const rows: Row[] = [
    { label: 'Trust name', value: data.trustName.trim() || null },
    { label: 'Date executed', value: fmtDate(data.dateExecuted) },
    { label: 'Settlor(s)', value: data.settlorName.trim() || null },
    { label: 'Governing law state', value: data.governingState || null },
    { label: 'Revocability', value: revocability },
    ...(data.revocability === 'revocable'
      ? [{ label: 'Power to revoke', value: data.powerToRevoke.trim() || null }]
      : []),
    { label: 'Currently acting trustee(s)', value: data.trusteeName.trim() || null },
    { label: 'Trustee address', value: data.trusteeAddress.trim() || null },
    {
      label: 'Co-trustees',
      value:
        data.coTrustees === 'multiple'
          ? 'Multiple trustees'
          : data.coTrustees === 'sole'
            ? 'Sole trustee'
            : null,
    },
    ...(data.coTrustees === 'multiple'
      ? [
          {
            label: 'Signing authority',
            value:
              data.coTrusteeAuthority === 'all'
                ? 'All trustees must sign'
                : data.coTrusteeAuthority === 'less'
                  ? 'Fewer than all may act'
                  : null,
          },
        ]
      : []),
    {
      label: 'Trustee powers',
      value:
        data.trusteePowers === 'general'
          ? 'General'
          : data.trusteePowers === 'specific'
            ? 'Specific'
            : null,
    },
    ...(data.trusteePowers === 'specific'
      ? [{ label: 'Specific powers', value: data.specificPowers.trim() || null }]
      : []),
    { label: 'Trust tax ID', value: data.trustTaxId.trim() || null },
    { label: 'Manner of taking title', value: data.mannerOfTitle.trim() || null },
    {
      label: 'Notary block',
      value: data.includeNotary === 'yes' ? 'Yes' : data.includeNotary === 'no' ? 'No' : null,
    },
  ];

  const filledCount = rows.filter((r) => r.value !== null).length;

  return (
    <aside class="certificate-preview" aria-label="Live preview of your Certificate of Trust">
      <details
        class="certificate-preview-sheet"
        open={open}
        onToggle={(e: any) => setOpen(e.currentTarget.open)}
      >
        <summary class="certificate-preview-toggle">
          <span class="certificate-preview-heading">Your document preview</span>
          <span class="certificate-preview-toggle-group" aria-hidden="true">
            <span class="certificate-preview-meta">{filledCount} of {rows.length} answered</span>
            <span class="certificate-preview-chevron">▾</span>
          </span>
        </summary>
        <div class="certificate-preview-body" role="region" aria-label="Certificate of Trust preview">
          <div class="certificate-preview-doc">
            <div class="certificate-preview-doc-title">Certificate of Trust</div>
            <div class="certificate-preview-doc-sub">Document summary · updates as you answer</div>
            <dl class="certificate-preview-rows">
              {rows.map((r) => (
                <div class="certificate-preview-row" key={r.label}>
                  <dt>{r.label}</dt>
                  <dd class={r.value === null ? 'certificate-preview-value--blank' : ''}>
                    {r.value === null ? NOT_ENTERED : r.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <p class="certificate-preview-note">
            This is a live summary of the facts that will appear in your generated PDF.
            Blank fields show as placeholders in the document. This preview is not legal advice.
          </p>
        </div>
      </details>
    </aside>
  );
}
