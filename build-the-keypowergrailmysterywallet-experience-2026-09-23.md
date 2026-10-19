# Build the KeyPowerGrailMysteryWallet experience

## Direction
Use the uploaded `FINAL-v5` package as the product baseline and the supplied KPGM artwork as the primary brand asset. Adapt it into the current app rather than copying the incompatible standalone project structure.

## Scope
- Replace the blank first screen with the KPGM wallet workspace.
- Preserve the supplied portfolio, swap, token launch, and GPT consultant views.
- Build a dark, high-contrast visual system inspired by the green, violet, and electric-blue KPGM artwork.
- Add clear wallet connection states, interactive navigation, form validation, notices, and mobile navigation.
- Keep blockchain, swap, launch, and AI actions in safe preview mode until their live services and verified token details are connected.
- Add KPGM-specific page metadata and verify the finished interface on desktop and mobile.

## Technical details
- Keep the current TanStack Start structure and route the full experience through `/`.
- Use the supplied artwork through the project asset pipeline.
- Use existing React and icon dependencies; avoid importing the standalone package's incompatible application shell.
- Use semantic design tokens in the global stylesheet and accessible controls throughout.
