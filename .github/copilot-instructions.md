# TorahCalc - Copilot Instructions

## Project Overview

TorahCalc is a comprehensive resource for Torah study (https://www.torahcalc.com), often referred to as "the Jewish Wolfram Alpha". It provides:

- Biblical and Talmudic unit conversions
- Gematria calculations
- Hebrew calendar and Zmanim (halachic times) information
- Daily learning schedules (Daf Yomi, etc.)
- Holiday information
- REST API for programmatic access

## Technology Stack

### Core Technologies

- **Framework**: [Svelte](https://svelte.dev/) 4.x with [SvelteKit](https://kit.svelte.dev/) 1.x
- **Build Tool**: Vite 4.x
- **Testing**: Vitest 3.x with jsdom
- **Linting**: ESLint 9.x + Prettier 3.x
- **Language**: JavaScript (with JSDoc type annotations and jsconfig.json for type checking)

### Key Dependencies

- **@hebcal/core & @hebcal/learning**: Hebrew calendar and Zmanim calculations
- **nearley**: Grammar parsing for natural language queries
- **dayjs**: Date manipulation
- **xss**: XSS sanitization
- **svelte-fa, @fortawesome/free-brands-svg-icons, @danieloi/pro-solid-svg-icons**: Font Awesome icons (pro included)
- **@capacitor**: Mobile app development (iOS/Android)

### Deployment

- **Primary**: Vercel (serverless with API routes)
- **Static build**: Available via adapter-static for mobile apps

## Project Structure

```
/home/runner/work/torahcalc/torahcalc/
├── src/
│   ├── lib/
│   │   ├── components/         # Reusable Svelte components
│   │   ├── js/                 # Core logic and calculators
│   │   │   ├── api/            # API helper functions
│   │   │   └── words/          # Gematria data for Hebrew words and sentences
│   │   ├── grammars/           # Nearley grammar definitions
│   │   │   ├── main.ne         # Main grammar file
│   │   │   ├── inputs/         # Grammar input definitions
│   │   │   ├── scripts/        # Grammar compilation scripts
│   │   │   └── generated/      # Generated grammar files (gitignored)
│   │   ├── data/               # Static data files (e.g., exchange rates)
│   │   ├── images/             # Image assets (logo)
│   │   └── icons/              # Custom icon definitions
│   ├── routes/                 # SvelteKit routes
│   │   ├── +page.svelte        # Homepage
│   │   ├── Header.svelte       # Header and navigation bar
│   │   ├── Footer.svelte       # Footer
│   │   ├── api/                # API endpoints (+server.js files)
│   │   ├── tools/              # Individual calculator tool UI pages
│   │   ├── info/               # Information pages (charts and sources)
│   │   ├── terms/              # Privacy policy and TOS pages
│   │   └── input/              # WolframAlpha-style English Input calculator
│   └── app.html                # HTML template
├── static/                     # Static assets (e.g. favicon, robots.txt)
├── resources/                  # Mobile app resources
├── .github/
│   ├── workflows/              # CI/CD workflows
│   ├── ISSUE_TEMPLATE/         # Issue templates
│   └── pull_request_template.md
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── svelte.config.js            # Svelte/SvelteKit configuration
├── capacitor.config.ts         # Capacitor mobile config
├── jsconfig.json               # JavaScript/TypeScript config
├── CONTRIBUTING.md             # Information on building and running the project
├── .env.local                  # Secrets (e.g. Google Maps API Key)
└── .env                        # Environment variables
```

## Development Workflow

### Installation

```bash
npm ci
```

### Grammar Compilation

Before building or testing, the Nearley grammar must be compiled:

```bash
npm run nearley
```

This script:

1. Runs `prepare-input.js` - generates grammar files from input definitions
2. Compiles `main.ne` to `generated/main.cjs` using `nearleyc`
3. Runs `modify-output.js` - post-processes the generated file

**Note**: The `dev`, `build`, and `test` scripts automatically run `npm run nearley` first.

### Development Server

```bash
npm run dev              # Start dev server (includes nearley compilation)
npm run dev -- --open    # Start dev server and open browser
```

### Building

```bash
npm run build    # Create a production build with the API and frontend
npm run static   # Build static frontend only
```

### Testing

```bash
npm run test            # Run tests with Vitest
npm run check           # Type check with svelte-check
npm run check:watch     # Type check in watch mode
```

**Known Test Issue**: Tests pass but show unhandled network errors trying to fetch from `old.torahcalc.com`. These are benign and do not affect test results. The domain is blocked in the sandboxed environment.

### Linting & Formatting

**Lint/Format Commands**:

```bash
npm run lint      # Run prettier check + eslint
npm run format    # Auto-format with prettier
```

## API Routes

API routes follow SvelteKit conventions using `+server.js` files:

- Located in `src/routes/api/`
- Each endpoint exports `GET` or `POST` request handlers
- Use helper functions from `$lib/js/api/response.js`:
  - `createResponse(data)` - Success response
  - `createErrorResponse(error)` - Error response
- Example: `/api/unitconverter`, `/api/gematria`, `/api/zmanim`

## Code Style & Patterns

### Type Annotations

The project uses JSDoc for type hints:

```javascript
/**
 * @typedef {{ name: string, value: number }} Unit
 */

/**
 * Convert units
 * @param {string} type - Unit type
 * @param {number} amount - Amount to convert
 * @returns {Promise<Unit>}
 */
async function convertUnits(type, amount) { ... }
```

### Test Structure

Tests use Vitest with describe/it blocks:

```javascript
import { describe, expect, it } from 'vitest';

describe('test conversions', () => {
	it('converts amah to meter', async () => {
		const result = await calculateQuery('convert 3.5 amah to meter');
		expect(result[0].title).toBe('Input Interpretation');
	});
});
```

Test files are co-located with source: `*.test.js` next to `*.js` files.

### Component Structure

Svelte components follow this pattern:

```svelte
<script>
	// Imports and logic
	import { onMount } from 'svelte';

	let data = [];

	onMount(async () => {
		// Initialization
	});
</script>

<svelte:head>
	<title>Page Title</title>
	<meta name="description" content="..." />
</svelte:head>

<!-- Template -->
<section>
	<!-- Content -->
</section>

<style>
	/* Scoped styles */
	section {
		/* ... */
	}
</style>
```

## CI/CD Workflows

Located in `.github/workflows/`:

### test.yml

- Runs on: Push to main, PRs to main
- Steps: checkout → npm ci → npm run test
- Note: Tests pass despite unhandled network errors (see Testing section)

### lint.yml

- Runs on: Push to main, PRs to main
- Steps: checkout → npm ci → npm run lint (attempts) → npm run format → auto-commit formatting
- Note: Currently fails on eslint step (see Linting section) but continues to format and commit

### deploy.yml

- Runs on: Push to main (when src files change)
- Steps: checkout → npm ci → npm run build → deploy to Vercel
- Requires secrets: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID

### exchange-rates.yml

- Updates currency exchange rates data

## Environment Variables

Required for certain features:

- `GOOGLE_MAPS_API_KEY` - For location-based Zmanim calculations
- `PUBLIC_ADAPTER` - Set to 'static' for static builds

See `.env.local.example` for template.

## Common Tasks

### Adding a New Unit Type

1. Add unit definitions to `src/lib/grammars/inputs/unit-inputs.js`
2. Run `npm run nearley` to regenerate grammar
3. Add conversion logic to `src/lib/js/unitconverter.js`
4. Add tests to `src/lib/js/unitconverter.test.js`

### Adding a New Calculator Tool

1. Add logic in `src/lib/js/` with a file `{my-tool}.js`
2. Add tests in `src/lib/js/` with a file `{my-tool}.test.js`
3. Create route directory: `src/routes/tools/{my-tool}/`
4. Add `+page.svelte` for the UI
5. Add `+page.js` if needed for data loading
6. Update navigation as needed in `src/routes/Header.svelte`
7. Create an API endpoint if needed (see "Adding an API endpoint" below)
8. Optionally update the grammar to support the new tool in the Input calculator (see "Modifying Grammar" below)

### Adding an API endpoint

1. Create `+server.js` file in `src/routes/api/{tool}/`
2. Export `GET` or `POST` request handlers using the logic from `src/lib/js/{tool}.js`
3. Use helper functions from `$lib/js/api/response.js`:
   - `createResponse(data)` - Success response
   - `createErrorResponse(error)` - Error response
4. Update API documentation if applicable at `src/routes/api/+page.svelte`
   Examples: `src/routes/api/unitconverter/+server.js`, `src/routes/api/zmanim/+server.js`

### Modifying Grammar

1. Edit `src/lib/grammars/main.ne` (or input files in `src/lib/grammars/inputs` for large lists of data to support)
2. Run `npm run nearley` to recompile
3. Test with `npm run test` or `npm run dev`
4. The generated files in `generated/` are gitignored and auto-created
5. If necessary, update `src/lib/js/input.js` and the test file `input.test.js` to support new grammar capabilities

### Adding a New API Endpoint

1. Create `+server.js` file in `src/routes/api/your-endpoint/`
2. Export `GET` or `POST` request handlers
3. Use helper functions from `$lib/js/api/response.js`:
   - `createResponse(data)` - Success response
   - `createErrorResponse(error)` - Error response
4. Add tests for the endpoint logic
5. Update API documentation if applicable

### Creating a New Svelte Component

1. Create component file in `src/lib/components/`
2. Follow the standard component structure:
   - `<script>` - Imports and logic
   - `<svelte:head>` - Page metadata (for pages)
   - Template - HTML markup
   - `<style>` - Scoped CSS
3. Use JSDoc comments for prop types
4. Add component to relevant pages

## Known Issues & Workarounds

### 1. Test Network Errors

**Issue**: Tests show unhandled errors fetching from old.torahcalc.com
**Impact**: None - tests still pass, these are informational
**Cause**: Domain is blocked in sandboxed environment
**Workaround**: Ignore these errors in test output

### 2. Build Warnings - GOOGLE_MAPS_API_KEY

**Issue**: Build shows warnings about GOOGLE_MAPS_API_KEY not being exported
**Impact**: None if not using location features
**Workaround**: Set GOOGLE_MAPS_API_KEY in .env for full functionality

### 3. Build Warnings - Unused CSS

**Issue**: Vite shows warnings about unused CSS selectors
**Impact**: None - cosmetic warnings only
**Workaround**: Ignore or clean up unused selectors if desired

### 4. npm audit Vulnerabilities

**Issue**: 15 vulnerabilities reported (4 low, 3 moderate, 8 high)
**Impact**: Most are in dev dependencies or deprecated packages
**Workaround**: Review with `npm audit` - many cannot be fixed without major version updates
**Note**: These are inherited from dependencies, not direct security issues in application code

## Tips for Agents

1. **Always run `npm run nearley`** before testing changes that affect input parsing
2. **Use JSDoc comments** for type hints instead of TypeScript
3. **Test locally** with `npm run dev` before committing
4. **Check test impact** with `npm run test -- --run` for focused test runs
5. **Format before commit** with `npm run format`
6. **For API changes**, update both the logic file and the corresponding `+server.js` route
7. **Svelte components** have reactive statements using `$:` - respect this pattern
8. **Don't commit generated files** in `src/lib/grammars/generated/` - they're auto-created

## Getting Help

- **Main Docs**: See CONTRIBUTING.md for contribution guidelines
- **Hebcal**: https://github.com/hebcal/hebcal - for calendar/Zmanim questions
- **Nearley**: https://nearley.js.org/ - for grammar questions
- **SvelteKit**: https://kit.svelte.dev/docs - for routing and API questions

## Quick Reference Commands

```bash
# Installation
npm ci

# Development
npm run dev                # Start dev server (auto-compiles grammar)
npm run nearley            # Just compile grammar

# Testing & Quality
npm run test               # Run all tests
npm run format             # Format code
npm run check              # Type check

# Building
npm run build              # Build for Vercel
npm run static             # Build static site
npm run preview            # Preview build
```
