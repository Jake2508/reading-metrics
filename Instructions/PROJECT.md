# Reading Metrics Dashboard

I am providing a DESIGN.md file that defines the visual style, spacing, typography, color palette, layout principles, component design, and overall design language for this project.

Your highest priority is faithfully implementing the DESIGN.md styling while creating a polished, production-quality application.

Do not invent a competing design system.

Use the DESIGN.md as the source of truth for all visual decisions.

---

# Project Overview

Build a responsive reading analytics dashboard that helps users explore and understand their reading habits through meaningful metrics, visualizations, and insights.

This should feel like a real product rather than a demo project.

The dashboard should be visually engaging, highly polished, and focused on turning a personal reading history into interesting insights.

The application should work well even with incomplete reading data.

---

# Core Goal

Transform a collection of books into a personal analytics experience.

The application should answer questions such as:

* How much have I read?
* Which authors have influenced me most?
* Which genres dominate my reading?
* What patterns exist in my reading history?
* How diverse are my reading habits?

The dashboard should feel personal and reflective rather than purely statistical.

---

# Required Dashboard Metrics

Prominently display:

* Total Books Read
* Total Pages Read
* Estimated Words Read
* Top Author
* Top Genre

These metrics should form the primary dashboard summary.

Use strong visual hierarchy and large, attention-grabbing metric cards.

---

# Top Author Section

Create a dedicated featured author area.

Include:

* Author name
* Number of books read
* Percentage of total books
* Author image if available
* Additional insights if useful

This should feel like a highlighted dashboard feature rather than a small statistic.

---

# Additional Insight Cards

Generate useful derived metrics where appropriate.

Potential examples:

* Average Pages Per Book
* Longest Book Read
* Shortest Book Read
* Number of Genres Explored
* Reading Diversity Score
* Most Productive Author
* Average Rating
* Favorite Genre
* Books Per Author

Only include metrics that genuinely add value.

Avoid filler statistics.

Avoid metrics that communicate the same information twice.

---

# Featured Book Section

Create a visually prominent featured book panel.

Examples:

* Highest Rated Book
* Longest Book
* Most Recently Finished Book
* Personal Favorite

Include:

* Cover image
* Title
* Author
* Genre
* Page count
* Rating if available

This section should help break up dashboard metrics and create visual interest.

---

# Reading DNA Section

Create a reading profile summary.

Examples:

* Fantasy: 42%
* Sci-Fi: 22%
* History: 18%
* Business: 12%
* Other: 6%

Present this in a visually engaging way.

The goal is to quickly communicate the user's reading personality.

This can be a chart, progress bars, cards, or another suitable visualization depending on the DESIGN.md style.

---

# Visualizations

Create meaningful visualizations from the available data.

Possible examples:

## Genre Distribution

Show:

* Books by genre
* Pages by genre

## Author Distribution

Show:

* Top authors
* Books per author

## Reading Trends

If reading dates are available:

* Books completed over time
* Pages read over time
* Reading activity by month or year

If reading dates are unavailable:

Replace time-based charts with more meaningful alternatives.

Do not show empty charts.

---

# Visualization Rules

Important:

Do not blindly implement every possible chart.

Evaluate whether each visualization provides unique information.

Avoid:

* Redundant charts
* Empty states
* Repetitive metrics
* Visual clutter

If a chart does not add value, replace it with a stronger insight.

Quality is more important than quantity.

---

# Layout & Information Architecture

Act as both a senior product designer and frontend engineer.

Continuously evaluate:

* Is the page visually balanced?
* Is there unnecessary whitespace?
* Is the hierarchy clear?
* Are charts appropriately sized?
* Do sections feel complete?

Avoid:

* Large empty areas
* Single cards floating by themselves
* Tiny charts surrounded by whitespace
* Overcrowded metric grids

If the layout feels sparse:

Prioritize:

* Rich insight cards
* Featured books
* Featured authors
* Reading summaries
* Book cover displays
* Reading profile sections

Before adding additional charts.

The final dashboard should feel complete, intentional, and visually balanced.

---

# Data Model

Assume each book contains:

* Title
* Author
* Genre
* Page Count
* Rating (optional)
* Date Finished (optional)
* Cover Image (optional)

Some historical records may be incomplete.

The application should gracefully handle missing values.

---

# Word Count Calculation

Do not store word counts directly.

Store page counts and derive estimated word counts.

Example:

Estimated Words Read = Total Pages × Average Words Per Page

Use a reasonable estimate and document the calculation.

---

# Data Entry & Book Management

The application requires a simple way to add books to the reading database.

Create an Admin Mode that can be enabled via a configuration flag or development setting.

This mode is intended for data management and population of the reading database.

---

# Add Book Workflow

Users should be able to:

1. Search for a book by title.
2. View matching results from a book API.
3. Select the correct book.
4. Review imported metadata.
5. Save the book to the collection.

The experience should be fast and simple.

---

# Imported Metadata

When available, automatically import:

* Title
* Author
* Cover Image
* Page Count
* Publication Date
* Categories / Genres
* Description

Users should always be able to edit imported values before saving.

---

# Manual Book Entry

Support manual creation of books for situations where:

* A book cannot be found.
* Metadata is incomplete.
* The user wants to override imported information.

Manual entries should integrate seamlessly with the analytics system.

---

# Data Quality

Book APIs are not always accurate.

Therefore:

* Users must confirm search results before saving.
* Imported metadata must remain editable.
* Multiple editions should be handled gracefully.
* Missing metadata should never break the dashboard.

---

# Book APIs

Use:

1. Open Library as the primary source.
2. Google Books as an optional fallback source.

Design the architecture so API providers can be swapped later.

---

# Admin Dashboard

Provide a lightweight management interface where books can be:

* Added
* Edited
* Deleted
* Re-imported

This interface does not need to be public-facing but should remain visually consistent with the overall design system.

---

# Seed Data

Create realistic sample data.

The dashboard should look complete and visually interesting immediately after installation.

Include:

* Multiple authors
* Multiple genres
* Cover images
* Different page counts
* Various ratings

The goal is for the dashboard to feel alive before real data is added.

---

# Technical Expectations

Use modern best practices.

Prefer:

* Clean component architecture
* Reusable UI components
* Responsive layouts
* Strong typing
* Accessibility considerations

The final result should feel like a polished SaaS analytics product rather than a tutorial project.

---

# Final Instruction

If a design or layout decision is unclear, prioritize:

1. Following the DESIGN.md.
2. Creating a visually balanced dashboard.
3. Displaying meaningful insights.
4. Eliminating unnecessary whitespace.
5. Building something that feels like a real product people would use.

Do not add sections simply to fill space.

Every chart, card, panel, and metric should have a clear purpose.
