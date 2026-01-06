import path from "path";

export const MENU = {
  /* =======================
   * 1. SEKRETARIAT (TEKS)
   * ======================= */
  1: {
    name: "Sekretariat",
    sub: {
      1: {
        name: "Informasi Umum",
        content: `ℹ️ *Informasi Umum Sekretariat*

Sekretariat Dinas Perikanan Kabupaten Gresik
melaksanakan fungsi administrasi, koordinasi,
dan pelayanan umum kepada masyarakat.

Pelayanan dilakukan secara tertib,
transparan, dan akuntabel.`
      },
      2: {
        name: "Jam Layanan",
        content: `🕘 *Jam Layanan Sekretariat*

Senin – Jumat
08.00 – 16.00 WIB

Pelayanan tidak beroperasi pada
hari libur nasional dan akhir pekan.`
      },
      3: {
        name: "Kontak",
        content: `📞 081334580496 (CP Tegar)
Dinas Perikanan Kabupaten Gresik

📞 Telepon: (031)3984523
📱 WhatsApp: 081334580496 (CP Tegar)
📧 Email: disperikanan@gresikkab.go.id`
      }
    }
  },

  /* =======================
   * 2. PERIKANAN TANGKAP
   * ======================= */
  2: {
    name: "Perikanan Tangkap",
    sub: {
      1: {
        name: "Standar Pelayanan",
        file: {
          type: "pdf",
          path: path.resolve("files/tangkap/standar-pelayanan.pdf")
        }
      },
      2: {
        name: "Perizinan Tangkap",
        file: {
          type: "pdf",
          path: path.resolve("files/tangkap/perizinan-tangkap.pdf")
        }
      },
      3: {
        name: "Pembinaan Nelayan",
        file: {
          type: "pdf",
          path: path.resolve("files/tangkap/pembinaan-nelayan.pdf")
        }
      }
    }
  },

  /* =======================
   * 3. PERIKANAN BUDIDAYA
   * ======================= */
  3: {
    name: "Perikanan Budidaya",
    sub: {
      1: {
        name: "Konsultasi Budidaya",
        file: {
          type: "pdf",
          path: path.resolve("files/budidaya/konsultasi-budidaya.pdf")
        }
      },
      2: {
        name: "Pembinaan Usaha",
        file: {
          type: "pdf",
          path: path.resolve("files/budidaya/pembinaan-budidaya.pdf")
        }
      },
      3: {
        name: "Monitoring Usaha",
        file: {
          type: "pdf",
          path: path.resolve("files/budidaya/monitoring-budidaya.pdf")
        }
      }
    }
  },

  /* =======================
   * 4. P2SDP
   * ======================= */
  4: {
    name: "P2SDP",
    sub: {
      1: {
        name: "Pengawasan",
        file: {
          type: "pdf",
          path: path.resolve("files/p2sdp/pengawasan-sumberdaya.pdf")
        }
      },
      2: {
        name: "Pengendalian",
        file: {
          type: "pdf",
          path: path.resolve("files/p2sdp/pengendalian-pemanfaatan.pdf")
        }
      },
      3: {
        name: "Penanganan Pelanggaran",
        file: {
          type: "pdf",
          path: path.resolve("files/p2sdp/penanganan-pelanggaran.pdf")
        }
      }
    }
  },

  /* =======================
   * 5. P2HP
   * ======================= */
  5: {
    name: "P2HP",
    sub: {
      1: {
        name: "Pengolahan Hasil",
        file: {
          type: "pdf",
          path: path.resolve("files/p2hp/pengolahan-hasil.pdf")
        }
      },
      2: {
        name: "Mutu & Keamanan Pangan",
        file: {
          type: "pdf",
          path: path.resolve("files/p2hp/mutu-keamanan-pangan.pdf")
        }
      },
      3: {
        name: "Fasilitasi Pemasaran",
        file: {
          type: "pdf",
          path: path.resolve("files/p2hp/fasilitasi-pemasaran.pdf")
        }
      }
    }
  }
};