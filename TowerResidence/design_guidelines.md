# Abiatar Residence Tower - Design Guidelines

## Design Approach

**Reference-Based Modern Real Estate**
Drawing inspiration from premium property listings (Airbnb property pages, Zillow, modern Brazilian real estate sites like QuintoAndar), we'll create a visually-driven, mobile-first experience that emphasizes aspirational lifestyle imagery while maintaining clear information hierarchy and strong conversion points.

**Core Principles:**
- Visual storytelling through high-quality imagery
- Trust-building through transparency and comprehensive information
- Immediate action focus with persistent WhatsApp CTA
- Location as primary selling point

---

## Typography System

**Font Stack:**
- Primary: 'Inter' or 'Nunito' from Google Fonts (modern, highly legible on mobile)
- Fallback: system-ui, sans-serif

**Hierarchy:**
- Hero Headline: 2.5rem (mobile) → 4rem (desktop), font-weight 700
- Section Headers: 1.75rem (mobile) → 2.5rem (desktop), font-weight 700
- Subsection Titles: 1.25rem (mobile) → 1.5rem (desktop), font-weight 600
- Body Text: 1rem, font-weight 400, line-height 1.6
- Feature Labels: 0.875rem, font-weight 500
- Location/Address: 1.125rem, font-weight 500

---

## Layout & Spacing System

**Tailwind Units:** Primary spacing units of 4, 6, 8, 12, 16, 20, 24
- Section Padding: py-12 (mobile) → py-20 (desktop)
- Component Spacing: space-y-8 (mobile) → space-y-12 (desktop)
- Grid Gaps: gap-4 (mobile) → gap-6 (desktop)
- Container: max-w-7xl mx-auto px-4

**Responsive Breakpoints:**
- Mobile: base (< 768px) - single column layouts
- Tablet: md (768px+) - 2 column where appropriate
- Desktop: lg (1024px+) - up to 3-4 columns for grids

---

## Page Structure & Components

### 1. Fixed Header
- Sticky position with backdrop blur
- Abiatar logo (left aligned, height: h-12)
- WhatsApp button (right aligned, visible on all viewports)
- Padding: px-4 py-3

### 2. Hero Section
**Layout:** Full-width background image with overlay
- Image: fachada_do_empreendimento.jpg as background
- Height: min-h-screen (mobile) → h-[85vh] (desktop)
- Dark gradient overlay (opacity 40-50%) for text legibility
- Content: Centered, max-w-4xl

**Elements:**
- Logo integration (if not in fixed header)
- Primary headline emphasizing lifestyle/location
- Supporting text (brief property description)
- Dual CTA buttons: Primary WhatsApp + Secondary "Ver Plantas"
- Buttons with backdrop-blur-sm bg-white/20 treatment

### 3. Location Spotlight Section
**Critical Priority - Appears immediately after hero**
- Background: Subtle accent treatment
- Prominent heading: "Localização Privilegiada no Centro de Taboão da Serra"
- Key callouts in 2-column grid (mobile stacks):
  - "Entre a Kalunga e o Banco do Brasil"
  - Visual map integration or location icon
- Address display: Rua João Slaviero - Jardim da Glória, 31

### 4. Amenities Grid
**Layout:** Responsive grid
- Mobile: grid-cols-2, gap-4
- Tablet: grid-cols-3, gap-6
- Desktop: grid-cols-4, gap-6

**Items (15 total):**
Piscina, Academia, Salão de Festas, Home Office, Playground, Deck Solar, Churrasqueira, Fitness Externo, Sala de Jogos, Mini Mercado, Redário, Brinquedoteca, Lounge Caffe, Estúdio Música, Pet Place

**Card Design:**
- Icon (from Heroicons - use appropriate amenity icons)
- Label text below
- Padding: p-4, rounded-xl
- Subtle border or shadow

### 5. Image Gallery Section
**Full-bleed carousel or masonry grid**
- Images: piscina.jpg, academia.jpg, vista_do_empreendimento.jpg, fachada
- Mobile: Single column scrollable
- Desktop: 2-3 column masonry or bento grid layout
- Each image: rounded-lg, aspect ratio preserved

### 6. Floor Plans Section
**Three plan types with cards**
- Title: "Opções de Plantas"
- Tabbed or side-by-side comparison
- Cards showing:
  - Plan image (planta_final images)
  - Area: 41m², 40m², 46m²
  - Bedrooms: 1 or 2 dormitórios
  - WhatsApp CTA specific to plan

**Layout:**
- Mobile: Stacked cards, space-y-6
- Desktop: grid-cols-3, gap-8

### 7. Final CTA Section
- Contrasting background
- Urgency messaging: "Não Perca Esta Oportunidade"
- Lançamento badge
- Large WhatsApp button
- Address repetition for clarity

### 8. Footer
- Contact information
- Address
- Social links (if applicable)
- Legal/credits
- Compact, py-8

---

## WhatsApp CTA Implementation

**Primary Button (Throughout):**
- Text: "Fale Conosco no WhatsApp"
- Link: `https://wa.me/5511970988512?text=Olá%20Gostaria%20de%20informações%20sobre%20o%20Tower`
- Size: Prominent on mobile (full-width or near-full)
- Icon: WhatsApp icon from Heroicons

**Floating Action Button (Mobile):**
- Fixed bottom-right position
- z-index high, always visible
- Circular, green (#25D366 - WhatsApp brand color allowed for this specific button)
- Pulsing animation (subtle)

---

## Images Strategy

**Hero:** fachada_do_empreendimento.jpg - full viewport, dramatic
**Gallery Section:** All provided images showcased
**Floor Plans:** Dedicated high-resolution display of planta images
**Logo:** logotipo.jpg in header

**Treatment:**
- All images: object-cover, optimized loading
- Lazy loading for below-fold content
- Aspect ratios maintained

---

## Animation & Interactions

**Minimal, purposeful animations only:**
- Fade-in on scroll for sections (subtle, once)
- Smooth scroll to anchors
- WhatsApp FAB pulse (2s interval)
- Image hover: slight scale (1.05) on desktop gallery

**No:** Parallax, excessive transitions, scroll-triggered animations beyond fade-in

---

## Mobile-First Specifics

**Touch targets:** Minimum 44px height for all interactive elements
**Typography scaling:** Larger base sizes for readability
**Navigation:** Simplified, hamburger if needed (though simple page may not need)
**CTAs:** Full or near-full width on mobile for easy tapping
**Images:** Optimized mobile sizes, portrait orientations prioritized

---

## Accessibility

- Alt text for all images (descriptive: "Piscina do Abiatar Residence Tower")
- ARIA labels for icon-only buttons
- Sufficient contrast ratios (especially text on images)
- Keyboard navigation support
- Focus states visible and clear