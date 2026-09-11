#!/usr/bin/env python3
"""generate-og.py — FreeTrustDocs branded OG image generator.

Renders 1200x630 PNGs from SVG templates using the site's own design system
(deep forest green #1a3c34, warm bronze #8b6914, cream #f8f5ef, Crimson Pro /
Inter / JetBrains Mono) and the EXISTING logo mark asset. No new brand marks.

Design: left cream canvas (kicker + serif title + domain footer), right dark
green "document panel" with the white logo mark, mono document label, and
signature-rule lines — evokes the legal-library aesthetic without stock icons.

Fonts: variable woff2 fonts from public/fonts are instantiated to static TTFs
(fontTools) and registered with fontconfig for librsvg.

Outputs:  public/og/*.png  +  src/lib/og-map.json (path -> og image mapping)
"""
import base64
import json
import os
import subprocess
import sys
import textwrap
from pathlib import Path

from fontTools import varLib
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SITE = Path(__file__).resolve().parent.parent          # site/
PUBLIC = SITE / "public"
FONTS = PUBLIC / "fonts"
OUT = PUBLIC / "og"
SRC = SITE / "src"
MAP_PATH = SRC / "lib" / "og-map.json"
FONT_DIR = Path.home() / ".cache" / "ftd-og-fonts"

# Brand palette (global.css tokens)
PRIMARY = "#1a3c34"      # deep forest green
PRIMARY_LIGHT = "#2d5a4e"
ACCENT = "#8b6914"       # warm bronze
CREAM = "#f8f5ef"
CREAM_DARK = "#ede7da"
BORDER = "#d4cfc4"
WHITE = "#ffffff"

W, H = 1200, 630

# ---------------------------------------------------------------- fonts ----

def instantiate(src: Path, dst: Path, wght: int):
    f = TTFont(str(src))
    instantiateVariableFont(f, {"wght": wght}, inplace=True)
    f.flavor = None  # strip WOFF2 container — fontconfig/librsvg need raw TTF
    f.save(str(dst))
    return dst

def prepare_fonts():
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    (FONT_DIR / "cache").mkdir(exist_ok=True)
    made = []
    for name, wght, out in [
        ("crimson-pro.woff2", 600, "crimson-600.ttf"),
        ("crimson-pro.woff2", 700, "crimson-700.ttf"),
        ("inter.woff2", 400, "inter-400.ttf"),
        ("inter.woff2", 600, "inter-600.ttf"),
        ("jetbrains-mono.woff2", 500, "jbmono-500.ttf"),
    ]:
        dst = FONT_DIR / out
        if not dst.exists():
            instantiate(FONTS / name, dst, wght)
        made.append(dst)
        # install for the system font stack (CoreText on macOS reads ~/Library/Fonts)
        lib_dst = Path.home() / "Library" / "Fonts" / out
        if not lib_dst.exists():
            subprocess.run(["cp", str(dst), str(lib_dst)], check=True)
    # fontconfig so librsvg finds the instantiated fonts (valid XML, no system fonts)
    fc = FONT_DIR / "fonts.conf"
    fc.write_text(
        '<?xml version="1.0"?>\n'
        '<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n'
        "<fontconfig>\n"
        f"  <dir>{FONT_DIR}</dir>\n"
        f"  <cachedir>{FONT_DIR}/cache</cachedir>\n"
        "</fontconfig>\n"
    )
    return fc

# ----------------------------------------------------------------- wrap ----

def wrap_title(title: str, max_chars_first=21, max_chars=23, max_lines=3):
    """Greedy word wrap tuned for Crimson Pro at ~58px in a ~660px box
    (x=90 to panel edge x=790, with ~40px right margin)."""
    words = title.split()
    lines, cur = [], ""
    limit = max_chars_first
    for w in words:
        cand = (cur + " " + w).strip()
        if len(cand) <= limit or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = w
            limit = max_chars
        if len(lines) == max_lines - 1:
            limit = max_chars
    if cur:
        lines.append(cur)
    return lines[:max_lines]

def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

# ----------------------------------------------------------------- svg -----

def doc_panel(label_lines, mark_inner, mark_vb):
    """Right-side dark green document panel with the white logo mark.

    The mark is embedded as a NESTED <svg> — a <g> ignores viewBox, which
    drew the 675x978 coordinate space far outside the panel. Nested svg
    scales it into place.
    """
    # mark aspect from viewBox (e.g. "697.0 534.8 675.4 978.5")
    _, _, mw, mh = [float(v) for v in mark_vb.split()]
    mark_h = 170
    mark_w = round(mark_h * (mw / mh))
    mark_x = 955 - mark_w / 2
    mark_svg = (
        f'<svg x="{mark_x:.0f}" y="100" width="{mark_w}" height="{mark_h}" '
        f'viewBox="{mark_vb}">{mark_inner}</svg>'
    )
    label_svg = ""
    y = 322
    for line in label_lines:
        label_svg += (
            f'<text x="955" y="{y}" font-family="JetBrains Mono" font-weight="500" '
            f'font-size="20" letter-spacing="3" fill="{CREAM}" opacity="0.92" '
            f'text-anchor="middle">{esc(line)}</text>'
        )
        y += 32
    rules = ""
    ry = 408
    for i, frac in enumerate((1.0, 0.82, 0.62)):
        wfrac = 230 * frac
        color = ACCENT if i == 0 else CREAM
        op = "0.95" if i == 0 else "0.3"
        rules += (
            f'<rect x="{955 - wfrac/2:.0f}" y="{ry}" width="{wfrac:.0f}" height="2.5" '
            f'fill="{color}" opacity="{op}" rx="1"/>'
        )
        ry += 34
    return f"""
  <g>
    <rect x="790" y="70" width="330" height="490" rx="14"
          fill="{PRIMARY}" stroke="{PRIMARY_LIGHT}" stroke-width="2"/>
    <rect x="790" y="70" width="330" height="490" rx="14"
          fill="none" stroke="{CREAM}" stroke-opacity="0.08" stroke-width="6"/>
    {mark_svg}
    {label_svg}
    {rules}
    <text x="955" y="534" font-family="JetBrains Mono" font-weight="500" font-size="16"
          letter-spacing="2" fill="{CREAM}" opacity="0.55" text-anchor="middle">NOTHING LEAVES YOUR BROWSER</text>
  </g>"""

def og_svg(kicker: str, title: str, panel_label, mark_svg, footer="freetrustdocs.com"):
    mark_inner, mark_vb = mark_svg
    lines = wrap_title(title)
    size = 58 if max(len(l) for l in lines) <= 21 else 48
    y0 = 210
    tspans = ""
    y = y0
    for line in lines:
        tspans += f'<text x="90" y="{y}" font-family="Crimson Pro" font-weight="600" font-size="{size}" fill="{PRIMARY}">{esc(line)}</text>'
        y += int(size * 1.22)
    label = doc_panel(panel_label, mark_inner, mark_vb)
    pattern = ""
    for gx in range(0, W, 60):
        pattern += f'<line x1="{gx}" y1="0" x2="{gx}" y2="{H}" stroke="{BORDER}" stroke-width="1" opacity="0.35"/>'
    for gy in range(0, H, 60):
        pattern += f'<line x1="0" y1="{gy}" x2="{W}" y2="{gy}" stroke="{BORDER}" stroke-width="1" opacity="0.35"/>'
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="{CREAM}"/>
  <g>{pattern}</g>
  <rect x="0" y="0" width="{W}" height="8" fill="{ACCENT}"/>
  <text x="90" y="128" font-family="JetBrains Mono" font-weight="500" font-size="22"
        letter-spacing="5" fill="{ACCENT}">{esc(kicker.upper())}</text>
  {tspans}
  <text x="90" y="560" font-family="Inter" font-weight="600" font-size="27" fill="{PRIMARY}" opacity="0.85">{esc(footer)}</text>
  {label}
</svg>"""

# ---------------------------------------------------------------- render ---

def render(svg: str, out: Path, fc: Path):
    svg_path = FONT_DIR / "tmp.svg"
    svg_path.write_text(svg)
    # NOTE: do NOT set FONTCONFIG_FILE — on macOS librsvg/pango resolves fonts
    # via CoreText and a custom fontconfig file *breaks* matching there.
    # Fonts are installed to ~/Library/Fonts by prepare_fonts() instead.
    subprocess.run(
        ["rsvg-convert", "-w", str(W), "-h", str(H), "-o", str(out), str(svg_path)],
        check=True, capture_output=True,
    )
    # compress
    subprocess.run(["magick", str(out), "-strip", "-define", "png:compression-level=9", str(out)],
                   check=True, capture_output=True)

def load_mark():
    """Return (inner SVG elements, viewBox) of the existing white logo mark."""
    p = PUBLIC / "images/logo/logo-mark-white.svg"
    raw = p.read_text()
    inner = raw.split(">", 1)[1].rsplit("</svg>", 1)[0]
    vb = raw.split('viewBox="')[1].split('"')[0] if 'viewBox="' in raw else "0 0 48 48"
    return inner, vb

def main():
    fc = prepare_fonts()
    mark_inner, mark_vb = load_mark()
    OUT.mkdir(parents=True, exist_ok=True)
    (SRC / "lib").mkdir(exist_ok=True)

    mark_svg = (mark_inner, mark_vb)  # tuple passed through to og_svg

    pages = []

    # Home
    pages.append(("home.png", "/",
        og_svg("Free Trust Document Generator", "Free trust documents, private by design",
               ["CERTIFICATE", "OF TRUST"], mark_svg)))

    # Hubs
    pages.append(("certificate-of-trust.png", "/certificate-of-trust/",
        og_svg("Free Generator + State Guide", "Certificate of Trust",
               ["CERTIFICATE", "OF TRUST"], mark_svg)))
    pages.append(("declaration-of-trust.png", "/declaration-of-trust/",
        og_svg("Free Generator + State Guide", "Declaration of Trust",
               ["DECLARATION", "OF TRUST"], mark_svg)))
    pages.append(("land-trust.png", "/land-trust/",
        og_svg("Free Generator + State Guide", "Land Trust Agreement",
               ["LAND TRUST", "AGREEMENT"], mark_svg)))
    pages.append(("best-states-for-trusts.png", "/best-states-for-trusts/",
        og_svg("2026 Comparison", "Best States for Trusts",
               ["STATE RANKINGS", "2026"], mark_svg)))
    pages.append(("about.png", "/about/",
        og_svg("About FreeTrustDocs", "Free, private trust document generation",
               ["ABOUT US"], mark_svg)))
    pages.append(("guides.png", "/guide/",
        og_svg("Trust Guides", "Trust guides, written to be genuinely educational",
               ["TRUST GUIDES"], mark_svg)))

    # Wizards
    for slug, label in [("certificate-of-trust", ["CERTIFICATE", "OF TRUST"]),
                        ("declaration-of-trust", ["DECLARATION", "OF TRUST"]),
                        ("land-trust", ["LAND TRUST", "AGREEMENT"])]:
        pages.append((f"create-{slug}.png", f"/create/{slug}/",
            og_svg("Free Document Wizard", f"Create your {slug.replace('-', ' ')} in minutes",
                   label, mark_svg)))

    # Guides (og-image per guide)
    guides = {
        "what-is-a-certificate-of-trust": "What is a Certificate of Trust?",
        "what-is-a-declaration-of-trust": "What is a Declaration of Trust?",
        "what-is-a-land-trust": "What is a Land Trust?",
        "land-trust-vs-llc": "Land Trust vs. LLC",
        "how-to-choose-a-trustee": "How to Choose a Trustee",
        "revocable-vs-irrevocable-trust": "Revocable vs. Irrevocable Trust",
        "trust-funding-checklist": "The Trust Funding Checklist",
        "certificate-of-trust-vs-declaration": "Certificate vs. Declaration of Trust",
        "business-trust-explained": "The Business Trust, Explained",
        "trust-trustee-duties": "Trustee Duties and Responsibilities",
        "how-to-revoke-a-trust": "How to Revoke a Trust",
        "trust-protector-explained": "What is a Trust Protector?",
        "trust-notarization": "Does a Trust Have to Be Notarized?",
        "michigan-trust-registration": "How to Register a Trust in Michigan",
        "land-trust-agreement": "Land Trust Agreement: What It Contains",
        "charitable-trust-registration": "Charitable Trust Registration",
    }
    for slug, title in guides.items():
        pages.append((f"guide-{slug}.png", f"/guide/{slug}/",
            og_svg("Trust Guide", title, ["TRUST GUIDE"], mark_svg)))

    og_map = {}
    for fname, path, svg in pages:
        render(svg, OUT / fname, fc)
        og_map[path] = f"/og/{fname}"
        print(f"rendered {fname} for {path}")

    (MAP_PATH).write_text(json.dumps(og_map, indent=1))
    print(f"map: {MAP_PATH} ({len(og_map)} entries)")

if __name__ == "__main__":
    main()