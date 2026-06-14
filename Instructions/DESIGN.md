# DESIGN.md

## Design System: Neubrutalism

### Design Philosophy

Create a bold, playful, high-contrast interface inspired by the Neubrutalism design movement.

The UI should feel:

* Confident
* Raw
* Playful
* Highly structured
* Visually distinctive
* Slightly imperfect in a deliberate way

Avoid polished corporate SaaS aesthetics.

The design should look intentional, memorable, and full of personality.

---

## Core Principles

### Borders Are Structural

Every major component should have a visible black border.

Borders are not decorative.

They define hierarchy and layout.

Use:

* 2px–4px solid black borders

Apply to:

* Cards
* Buttons
* Inputs
* Navigation
* Charts
* Panels

---

### Shadows Create Depth

Use hard offset shadows.

Never use blur shadows.

Good:

box-shadow: 4px 4px 0 #000

Bad:

box-shadow: 0 8px 32px rgba(0,0,0,0.2)

The interface should feel like stacked paper cutouts.

---

### Color Is Bold

Use bright, saturated colors.

Primary palette:

* Yellow: #FFEB3B
* Red: #FF5252
* Blue: #2196F3
* Black: #000000

Use large blocks of color.

Avoid:

* Gradients
* Glassmorphism
* Subtle tinting
* Muted palettes

White and neutral backgrounds should provide breathing room.

---

### Typography Is a Visual Element

Use bold typography throughout.

Preferred font stack:

* Inter
* System UI
* Sans-serif

Weights:

* Headlines: 700–900
* UI Labels: 600–700
* Body Text: 400–500

Headlines should feel impactful and oversized.

---

## Component Styling

### Cards

* 3px black border
* Hard offset shadow
* Bright background colors or white surface
* Large internal padding
* Strong visual separation

### Buttons

* Thick border
* Hard shadow
* Bold text
* Clear hover states

Hover:

* Slight upward movement
* Shadow adjustment

Active:

* Slight press effect

### Inputs

* Black border
* Clear focus state
* No glow effects
* No floating labels

### Charts

Charts should match the design system.

Use:

* Black outlines
* Flat colors
* High contrast

Avoid:

* Gradient fills
* Soft shadows
* Modern glass effects

---

## Layout Principles

Use a dashboard-first layout.

Content should feel dense enough to be useful without feeling crowded.

Avoid:

* Large empty spaces
* Tiny cards floating in large containers
* Excessive padding

Use:

* Strong visual hierarchy
* Large metric cards
* Asymmetrical layouts
* Featured content sections

Metrics should feel substantial and visually important.

---

## Motion

Keep animation minimal.

Use:

* 200–300ms transitions
* Small hover movements
* Simple fade-ins

Avoid:

* Complex motion
* Elastic animations
* Excessive effects

---

## Reading Dashboard Adaptation

For this project specifically:

* Treat dashboard metrics as hero elements.
* Make charts feel like physical dashboard widgets.
* Use book covers to add visual richness.
* Feature authors and books prominently.
* Use color strategically to create hierarchy.
* If a section feels empty, replace it with a more useful insight rather than adding filler content.

The dashboard should feel like a personal reading intelligence product built in a bold neubrutalist style.

---

## Forbidden Patterns

Do not use:

* Gradients
* Glassmorphism
* Blurred shadows
* Thin borders
* Muted gray SaaS design
* Bootstrap-style layouts
* Excessive whitespace
* Generic dashboard templates
* Emoji icons

Use SVG icons where needed.
