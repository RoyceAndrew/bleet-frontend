// cropImage.ts

export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // untuk menghindari masalah CORS
      image.src = url;
    });
  
  export function getRadianAngle(degreeValue: number): number {
    return (degreeValue * Math.PI) / 180;
  }
  
  /**
   * Menghitung ukuran bounding box baru untuk sebuah persegi panjang yang telah dirotasi.
   */
  export function rotateSize(
    width: number,
    height: number,
    rotation: number
  ): { width: number; height: number } {
    const rotRad = getRadianAngle(rotation);
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  }
  
  export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface Flip {
    horizontal: boolean;
    vertical: boolean;
  }
  
  /**
   * Fungsi ini meng-crop gambar berdasarkan URL sumber, area crop (pixelCrop),
   * rotasi (dalam derajat), dan opsi flip.
   *
   * @param imageSrc - URL atau data URL gambar yang akan di-crop.
   * @param pixelCrop - Objek yang memiliki properti { x, y, width, height } (dalam piksel).
   * @param rotation - Nilai rotasi dalam derajat (default 0).
   * @param flip - Opsi flip, default { horizontal: false, vertical: false }.
   * @returns Promise<string> - URL objek (dari Blob) hasil crop.
   */
  export default async function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop,
    rotation: number = 0,
    flip: Flip = { horizontal: false, vertical: false }
  ): Promise<string> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    if (!ctx) {
      throw new Error("2d context not available");
    }
  
    const rotRad = getRadianAngle(rotation);
  
    // Hitung bounding box dari gambar yang sudah dirotasi
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );
  
    // Set ukuran canvas sesuai bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;
  
    // Pindahkan origin ke tengah agar rotasi dan flipping berjalan dengan benar
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);
  
    // Gambar gambar yang sudah dirotasi ke canvas
    ctx.drawImage(image, 0, 0);
  
    // Buat canvas baru untuk hasil crop
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");
  
    if (!croppedCtx) {
      throw new Error("2d context not available for cropped canvas");
    }
  
    // Atur ukuran canvas hasil crop
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;
  
    // Gambar potongan gambar ke canvas hasil crop
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  
    // Ubah canvas crop ke Blob dan kembalikan URL objeknya
    return new Promise((resolve, reject) => {
      croppedCanvas.toBlob((file) => {
        if (file) {
          resolve(URL.createObjectURL(file));
        } else {
          reject(new Error("Canvas is empty"));
        }
      }, "image/jpeg");
    });
  }
  