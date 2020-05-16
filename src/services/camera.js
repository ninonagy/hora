import {
  Plugins,
  CameraResultType,
  CameraSource,
  Filesystem,
} from "@capacitor/core";

const { Camera } = Plugins;

export default async function takePicture() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
  });

  return { format: image.format, data: image.dataUrl, path: image.webPath };
  // return Filesystem.readFile({ path: image.path });
}
