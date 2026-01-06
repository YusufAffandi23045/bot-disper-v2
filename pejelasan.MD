# Panduan Konten Menu Bot

Semua menu leaf menggunakan properti `contents[]`.

## Struktur Umum
```js
{
  title: "Judul Menu",
  contents: [ ... ]
}

Teks
{
  type: "text",
  value: "Isi teks..."
}

File PDF
{
  type: "file",
  path: "./files/path/file.pdf",
  filename: "Nama File.pdf"
}

Gambar
{
  type: "image",
  path: "./files/path/image.jpg",
  caption: "Keterangan gambar"
}

Kontak
{
  type: "contacts",
  list: [
    {
      name: "Nama Admin",S
      phone: "08xxxx",
      note: "Catatan opsional"
    }
  ]
}