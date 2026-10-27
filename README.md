# Mnemo

A films & TV tracker: keep a watchlist, log what you watched, share it with friends.

Mnemo (Greek _mneme_, memory) is the successor to
[Radar](https://github.com/MichalDakowicz/radar), rebuilt in the look of
[Matro](https://github.com/MichalDakowicz/matro). Early days: the app is a scaffold while
Radar's features are ported over.

## Stack

Expo SDK 57, React Native 0.86, Expo Router, NativeWind.

## Develop

```sh
npm install
npm start                        # dev server
npx expo run:android --device    # build to a connected Android phone
npm test                         # Jest
npm run lint
npx tsc --noEmit
```

## License

GPL-3.0, see [LICENSE](LICENSE).
