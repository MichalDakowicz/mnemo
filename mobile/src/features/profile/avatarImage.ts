import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

// Phone avatar upload: pick from the gallery (square crop in the picker), downscale to 256px and return a
// JPEG data URI. Same payload Radar writes to profiles.pfp (data URI, 256px, quality .7).
export const AVATAR_SIZE = 256;

/** Opens the gallery and resolves with the processed avatar, or null when cancelled. */
export async function pickAvatar(): Promise<string | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });
  const asset = result.canceled ? null : result.assets[0];
  if (!asset) return null;
  const out = await ImageManipulator.manipulateAsync(asset.uri, [{ resize: { width: AVATAR_SIZE, height: AVATAR_SIZE } }], {
    compress: 0.7,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });
  if (!out.base64) throw new Error('Could not process the image.');
  return `data:image/jpeg;base64,${out.base64}`;
}
