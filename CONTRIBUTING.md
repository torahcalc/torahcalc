## Developing

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Run tests:

```bash
npm run test
```

Lint code:

```bash
npm run lint
```

Format code with prettier:

```bash
npm run format
```

## Building

To create a production build with the API and frontend:

```bash
npm run build
```

To create a production build with the **frontend only**:

```bash
npm run static
```

To compile the Nearley grammar only:

```bash
npm run nearley
```

You can preview the production build with `npm run preview`.

## Mobile development

To build the static site and sync the capacitor project with the web app:

```bash
npm run mobile
```

To build the static site, sync the capacitor project, and open the project in Android Studio:

```bash
npm run android:dev
```

To build the static site, sync the capacitor project, and open the project in Xcode:

```bash
npm run ios:dev
```

## Common Development Tasks

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
6. If ambiguities arise, consider adding disambiguation logic to `getValidDerivations()` in `input.js`
7. Update the input examples if needed in `src/routes/input/InputExamples.svelte` and `src/routes/input/examples/`.

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

## Code Style Guidelines

- Use **JSDoc comments** for type hints
- Format code with `npm run format` before committing
- Follow existing patterns in similar files
- Co-locate test files with source files (`*.test.js` next to `*.js`)
- Keep components focused and reusable
- Use Svelte's reactive statements (`$:`) when appropriate

## Getting Help

- Check existing code for patterns and examples
- Review [SvelteKit documentation](https://kit.svelte.dev/docs) for framework questions
- Consult [Hebcal documentation](https://github.com/hebcal/hebcal) for calendar/Zmanim questions
- Use issue templates in `.github/ISSUE_TEMPLATE/` when reporting bugs or requesting features
