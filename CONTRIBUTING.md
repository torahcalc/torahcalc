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

To build the static site, sync the capacitor project, and open the project in Android Studio:

```bash
npm run ios:dev
```
