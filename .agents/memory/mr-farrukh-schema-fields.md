---
name: Mr Farrukh DB field names
description: Correct field names for Appointment, Testimonial, and Service types — critical for frontend form wiring and display.
---

## Appointment fields
`name`, `phone`, `email`, `service` (string name, NOT serviceId), `date`, `time`, `notes`, `status`

## Testimonial fields
`name`, `rating`, `text` (NOT `content` or `authorName`)

## Service fields
`name`, `category`, `description`, `imageUrl` (nullable), `duration`, `featured`
No `durationMinutes` field — use `category` or `description` for display.

## Staff fields
`name`, `role`, `experience`, `specializations`, `languages`, `imageUrl` (nullable), `bio`

**Why:** Design subagents repeatedly guess wrong field names (customerName, authorName, content, serviceId, durationMinutes). These are the actual column names from the Drizzle schema.

**How to apply:** Always pass this file via `relevantFiles` when launching a design subagent for this project, or paste the field list in the brief.
