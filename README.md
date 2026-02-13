# iOS Swipe preventDefault Regression Reproducer

Minimal reproducer for a regression in `@react-navigation/stack` where `event.preventDefault()` is **ignored** during iOS swipe-back gestures in `beforeRemove` listeners.

## The Bug

After PR [#12845](https://github.com/react-navigation/react-navigation/pull/12845) ("refactor: migrate stack card to function component"), calling `event.preventDefault()` in a `beforeRemove` listener no longer cancels iOS swipe-back gestures. The event fires, `preventDefault()` is called, but the gesture animation completes anyway and the user lands on the previous screen.

This affects:

- Custom `navigation.addListener('beforeRemove', ...)` handlers
- The built-in `usePreventRemove()` hook

![Demo video](./assets/react-navigation-prevent-default-demo.mp4)

**`preventDefault()` still works correctly for:**

- Header back button press
- `navigation.goBack()` calls
- Android hardware back button

## Version Presets

| Preset       | `@react-navigation/stack` | Status                                   |
| ------------ | ------------------------- | ---------------------------------------- |
| `working`    | `7.6.3`                   | `preventDefault()` works on swipe-back   |
| `just-broke` | `7.6.4`                   | `preventDefault()` ignored on swipe-back |
| `latest`     | `7.7.1`                   | `preventDefault()` ignored on swipe-back |

## Setup

```bash
# Install dependencies
yarn install

# iOS only: install CocoaPods
cd ios && bundle install && bundle exec pod install && cd ..
```

## Testing

### Switch Between Version Presets

```bash
# Use the last working version
yarn use:working

# Use the first broken version
yarn use:just-broke

# Use the latest stable version
yarn use:latest
```

> **Note:** After switching clear the metro cache:
> `yarn start --reset-cache`

### Run

```bash
# iOS (where the bug manifests)
yarn ios

# Android (for comparison — works fine)
yarn android
```

### Steps to Reproduce

1. Start the app on iOS (simulator or device)
2. Tap **"Test: addListener('beforeRemove')"**
3. Swipe from the left edge of the screen to trigger the back gesture
4. **Expected:** Event log shows "preventDefault() CALLED", you stay on the test screen
5. **Actual (broken versions):** Event log shows "preventDefault() CALLED" but you navigate back to Home anyway

The **Home screen** shows a red "Return Detection Log" when you arrive back unexpectedly, confirming the bug.

Repeat with the **"Test: usePreventRemove()"** screen to confirm the official hook is also affected.

### Expected Results by Preset

| Preset       | iOS Swipe Back           | Header Back | goBack() |
| ------------ | ------------------------ | ----------- | -------- |
| `working`    | Blocked (stay on screen) | Blocked     | Blocked  |
| `just-broke` | **NOT blocked (BUG)**    | Blocked     | Blocked  |
| `latest`     | **NOT blocked (BUG)**    | Blocked     | Blocked  |

## Likely Root Cause

PR [#12845](https://github.com/react-navigation/react-navigation/pull/12845) refactored the stack `Card` component from a class to a function component. This change (commit [`146cb8d5`](https://github.com/react-navigation/react-navigation/commit/146cb8d5a07111473d918c8ea76f4b0384e41bbb)) altered the gesture handling lifecycle such that `preventDefault()` no longer cancels the swipe-back animation.

Follow-up PR [#12846](https://github.com/react-navigation/react-navigation/pull/12846) addressed animation timing issues from the same refactor but did not fix this `preventDefault()` regression.

## Environment

- React Native: 0.83.2
- React: 19.2.0
- Xcode: 16.4
- iOS Simulator: iPhone 16 Pro - iOS 18.6

## Workaround

The only current workaround is to disable the swipe gesture entirely:

```tsx
<Stack.Screen
  name="ProtectedScreen"
  component={ProtectedScreen}
  options={{ gestureEnabled: false }}
/>
```

This removes the gesture entirely instead of intercepting it, which is not ideal.
