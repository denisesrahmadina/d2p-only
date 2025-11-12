import { BAPBDocument, BASTBDocument } from '../data/mockData/apbaMockData';

/**
 * Generate BAPB (Berita Acara Pemeriksaan Barang) Document
 * Based on PLN Template: 20241312 PLN - BPR - Template BAPB
 */
export const generateBAPBDocument = (bapb: BAPBDocument): string => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BAPB - ${bapb.bapb_number}</title>
    <style>
        @page {
            size: A4;
            margin: 2.5cm 2cm;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            max-width: 21cm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 10px 0;
            text-transform: uppercase;
        }

        .header h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 5px 0;
        }

        .doc-number {
            text-align: center;
            font-weight: bold;
            margin: 20px 0;
            font-size: 12pt;
        }

        .section {
            margin: 20px 0;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            text-decoration: underline;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .info-table td {
            padding: 5px;
            vertical-align: top;
        }

        .info-table td:first-child {
            width: 35%;
            font-weight: normal;
        }

        .info-table td:nth-child(2) {
            width: 5%;
            text-align: center;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .items-table th,
        .items-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        .items-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }

        .items-table td.center {
            text-align: center;
        }

        .items-table td.right {
            text-align: right;
        }

        .signature-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }

        .signature-table {
            width: 100%;
            margin-top: 30px;
        }

        .signature-table td {
            width: 33.33%;
            vertical-align: top;
            text-align: center;
        }

        .signature-box {
            margin-top: 80px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }

        .signature-name {
            font-weight: bold;
        }

        .signature-position {
            font-style: italic;
            font-size: 10pt;
        }

        .notes {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #003366;
        }

        .notes-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }

        @media print {
            body {
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px; padding: 10px; background: #003366; color: white; text-align: center;">
        <button onclick="window.print()" style="background: white; color: #003366; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; border-radius: 5px;">
            Print / Save as PDF
        </button>
    </div>

    <!-- Header -->
    <div class="header">
        <h1>BERITA ACARA PEMERIKSAAN BARANG (BAPB)</h1>
        <h2>PT PLN INDONESIA POWER</h2>
    </div>

    <!-- Document Number -->
    <div class="doc-number">
        Nomor: ${bapb.bapb_number}
    </div>

    <!-- Opening Statement -->
    <div class="section">
        <p style="text-align: justify; text-indent: 50px;">
            Pada hari ini, ${formatDate(bapb.inspection_date)}, kami yang bertanda tangan di bawah ini telah melakukan
            pemeriksaan barang sesuai dengan Purchase Order terkait dan dengan ini menyatakan bahwa:
        </p>
    </div>

    <!-- PO Information -->
    <div class="section">
        <div class="section-title">I. DATA PEMBELIAN</div>
        <table class="info-table">
            <tr>
                <td>Nomor Purchase Order</td>
                <td>:</td>
                <td><strong>${bapb.po_number}</strong></td>
            </tr>
            <tr>
                <td>Nomor Kontrak</td>
                <td>:</td>
                <td>${bapb.contract_number}</td>
            </tr>
            <tr>
                <td>Tanggal Pemeriksaan</td>
                <td>:</td>
                <td>${formatDate(bapb.inspection_date)}</td>
            </tr>
            <tr>
                <td>Lokasi Pemeriksaan</td>
                <td>:</td>
                <td>${bapb.inspection_location}</td>
            </tr>
        </table>
    </div>

    <!-- Vendor Information -->
    <div class="section">
        <div class="section-title">II. DATA VENDOR/PEMASOK</div>
        <table class="info-table">
            <tr>
                <td>Nama Vendor</td>
                <td>:</td>
                <td><strong>${bapb.vendor_name}</strong></td>
            </tr>
            <tr>
                <td>Perwakilan Vendor</td>
                <td>:</td>
                <td>${bapb.vendor_representative}</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${bapb.vendor_representative_position}</td>
            </tr>
        </table>
    </div>

    <!-- Items Details -->
    <div class="section">
        <div class="section-title">III. RINCIAN BARANG YANG DIPERIKSA</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 30%;">Nama Barang</th>
                    <th style="width: 20%;">Deskripsi</th>
                    <th style="width: 10%;">Satuan</th>
                    <th style="width: 10%;">Qty Dipesan</th>
                    <th style="width: 10%;">Qty Diterima</th>
                    <th style="width: 10%;">Qty Diperiksa</th>
                    <th style="width: 10%;">Qty Disetujui</th>
                    <th style="width: 10%;">Qty Ditolak</th>
                    <th style="width: 10%;">Status</th>
                </tr>
            </thead>
            <tbody>
                ${bapb.items.map((item, index) => `
                <tr>
                    <td class="center">${index + 1}</td>
                    <td>${item.item_name}</td>
                    <td>${item.item_description || '-'}</td>
                    <td class="center">${item.unit_of_measure}</td>
                    <td class="center">${item.ordered_quantity}</td>
                    <td class="center">${item.received_quantity}</td>
                    <td class="center">${item.inspected_quantity}</td>
                    <td class="center">${item.approved_quantity}</td>
                    <td class="center">${item.rejected_quantity}</td>
                    <td class="center">
                        <span style="color: ${item.inspection_result === 'PASS' ? 'green' : item.inspection_result === 'FAIL' ? 'red' : 'orange'}; font-weight: bold;">
                            ${item.inspection_result}
                        </span>
                    </td>
                </tr>
                ${item.rejection_reason ? `
                <tr>
                    <td colspan="10" style="background-color: #fff3cd; padding: 8px;">
                        <strong>Alasan Penolakan:</strong> ${item.rejection_reason}
                    </td>
                </tr>
                ` : ''}
                ${item.notes ? `
                <tr>
                    <td colspan="10" style="background-color: #e7f3ff; padding: 8px;">
                        <strong>Catatan:</strong> ${item.notes}
                    </td>
                </tr>
                ` : ''}
                `).join('')}
            </tbody>
        </table>
    </div>

    <!-- Inspection Notes -->
    ${bapb.inspection_notes ? `
    <div class="notes">
        <div class="notes-title">CATATAN PEMERIKSAAN:</div>
        <p>${bapb.inspection_notes}</p>
    </div>
    ` : ''}

    <!-- Summary -->
    <div class="section">
        <div class="section-title">IV. KESIMPULAN</div>
        <p style="text-align: justify;">
            Berdasarkan pemeriksaan yang telah dilakukan, dari total
            <strong>${bapb.items.reduce((sum, item) => sum + item.received_quantity, 0)}</strong> item yang diterima,
            sebanyak <strong>${bapb.items.reduce((sum, item) => sum + item.approved_quantity, 0)}</strong> item disetujui
            dan <strong>${bapb.items.reduce((sum, item) => sum + item.rejected_quantity, 0)}</strong> item ditolak.
        </p>
    </div>

    <!-- Signatures -->
    <div class="signature-section">
        <p style="font-weight: bold; margin-bottom: 20px;">Demikian Berita Acara ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>

        <table class="signature-table">
            <tr>
                <td>
                    <div><strong>PIHAK VENDOR</strong></div>
                    <div style="margin-top: 10px; font-style: italic;">Pembuat (Maker)</div>
                    ${bapb.signatures?.vendor_maker ? `
                    <div style="margin-top: 10px; margin-bottom: 10px;">
                        <img src="${bapb.signatures.vendor_maker.signature_data}"
                             alt="Signature"
                             style="max-width: 150px; height: auto;" />
                    </div>
                    <div class="signature-box">
                        <div class="signature-name">${bapb.signatures.vendor_maker.name}</div>
                        <div class="signature-position">${bapb.signatures.vendor_maker.position}</div>
                        <div style="font-size: 9pt; margin-top: 5px;">Tanggal: ${formatDate(bapb.signatures.vendor_maker.signed_at)}</div>
                    </div>
                    ` : `
                    <div class="signature-box">
                        <div class="signature-name">${bapb.vendor_representative}</div>
                        <div class="signature-position">${bapb.vendor_representative_position}</div>
                    </div>
                    `}
                </td>
                <td>
                    <div><strong>PIHAK PLN</strong></div>
                    <div style="margin-top: 10px; font-style: italic;">Pemeriksa (Checker)</div>
                    ${bapb.signatures?.pln_checker ? `
                    <div style="margin-top: 10px; margin-bottom: 10px;">
                        <img src="${bapb.signatures.pln_checker.signature_data}"
                             alt="Signature"
                             style="max-width: 150px; height: auto;" />
                    </div>
                    <div class="signature-box">
                        <div class="signature-name">${bapb.signatures.pln_checker.name}</div>
                        <div class="signature-position">${bapb.signatures.pln_checker.position}</div>
                        <div style="font-size: 9pt; margin-top: 5px;">Tanggal: ${formatDate(bapb.signatures.pln_checker.signed_at)}</div>
                    </div>
                    ` : `
                    <div class="signature-box">
                        <div class="signature-name">${bapb.pln_inspector}</div>
                        <div class="signature-position">${bapb.pln_inspector_position}</div>
                    </div>
                    `}
                </td>
                <td>
                    <div><strong>PIHAK PLN</strong></div>
                    <div style="margin-top: 10px; font-style: italic;">Penyetuju (Approver)</div>
                    ${bapb.signatures?.pln_approver ? `
                    <div style="margin-top: 10px; margin-bottom: 10px;">
                        <img src="${bapb.signatures.pln_approver.signature_data}"
                             alt="Signature"
                             style="max-width: 150px; height: auto;" />
                    </div>
                    <div class="signature-box">
                        <div class="signature-name">${bapb.signatures.pln_approver.name}</div>
                        <div class="signature-position">${bapb.signatures.pln_approver.position}</div>
                        <div style="font-size: 9pt; margin-top: 5px;">Tanggal: ${formatDate(bapb.signatures.pln_approver.signed_at)}</div>
                    </div>
                    ` : `
                    <div class="signature-box">
                        <div class="signature-name">_________________</div>
                        <div class="signature-position">Quality Assurance Manager</div>
                    </div>
                    `}
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Dokumen ini dibuat secara elektronik melalui Sistem APBA PT PLN Indonesia Power</p>
        <p>Nomor: ${bapb.bapb_number} | Dibuat: ${formatDate(bapb.created_at || bapb.inspection_date)}</p>
    </div>
</body>
</html>
  `;
};

/**
 * Generate BASTB (Berita Acara Serah Terima Barang) Document
 * Based on PLN Template: 20241312 PLN - BPR - Template BASTB
 */
export const generateBASTBDocument = (bastb: BASTBDocument): string => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BASTB - ${bastb.bastb_number}</title>
    <style>
        @page {
            size: A4;
            margin: 2.5cm 2cm;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            max-width: 21cm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 10px 0;
            text-transform: uppercase;
        }

        .header h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 5px 0;
        }

        .doc-number {
            text-align: center;
            font-weight: bold;
            margin: 20px 0;
            font-size: 12pt;
        }

        .section {
            margin: 20px 0;
        }

        .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            text-decoration: underline;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .info-table td {
            padding: 5px;
            vertical-align: top;
        }

        .info-table td:first-child {
            width: 35%;
            font-weight: normal;
        }

        .info-table td:nth-child(2) {
            width: 5%;
            text-align: center;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .items-table th,
        .items-table td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }

        .items-table th {
            background-color: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }

        .items-table td.center {
            text-align: center;
        }

        .items-table td.right {
            text-align: right;
        }

        .signature-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }

        .signature-table {
            width: 100%;
            margin-top: 30px;
        }

        .signature-table td {
            width: 50%;
            vertical-align: top;
            text-align: center;
            padding: 0 20px;
        }

        .signature-box {
            margin-top: 80px;
            border-top: 1px solid #000;
            padding-top: 5px;
        }

        .signature-name {
            font-weight: bold;
        }

        .signature-position {
            font-style: italic;
            font-size: 10pt;
        }

        .notes {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-left: 4px solid #003366;
        }

        .notes-title {
            font-weight: bold;
            margin-bottom: 10px;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }

        .declaration-box {
            border: 2px solid #003366;
            padding: 20px;
            margin: 20px 0;
            background-color: #f0f8ff;
        }

        @media print {
            body {
                padding: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="no-print" style="margin-bottom: 20px; padding: 10px; background: #003366; color: white; text-align: center;">
        <button onclick="window.print()" style="background: white; color: #003366; border: none; padding: 10px 20px; cursor: pointer; font-weight: bold; border-radius: 5px;">
            Print / Save as PDF
        </button>
    </div>

    <!-- Header -->
    <div class="header">
        <h1>BERITA ACARA SERAH TERIMA BARANG (BASTB)</h1>
        <h2>PT PLN INDONESIA POWER</h2>
    </div>

    <!-- Document Number -->
    <div class="doc-number">
        Nomor: ${bastb.bastb_number}
    </div>

    <!-- Opening Statement -->
    <div class="section">
        <p style="text-align: justify; text-indent: 50px;">
            Pada hari ini, ${formatDate(bastb.handover_date)}, kami yang bertanda tangan di bawah ini:
        </p>
    </div>

    <!-- Parties Information -->
    <div class="section">
        <table class="info-table" style="margin-left: 40px;">
            <tr>
                <td colspan="3"><strong>PIHAK PERTAMA (VENDOR/PEMASOK)</strong></td>
            </tr>
            <tr>
                <td>Nama Perusahaan</td>
                <td>:</td>
                <td><strong>${bastb.vendor_name}</strong></td>
            </tr>
            <tr>
                <td>Diwakili oleh</td>
                <td>:</td>
                <td>${bastb.vendor_representative}</td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${bastb.vendor_representative_position}</td>
            </tr>
            <tr>
                <td colspan="3" style="padding-top: 20px;"><strong>PIHAK KEDUA (PT PLN INDONESIA POWER)</strong></td>
            </tr>
            <tr>
                <td>Penerima</td>
                <td>:</td>
                <td><strong>${bastb.pln_receiver}</strong></td>
            </tr>
            <tr>
                <td>Jabatan</td>
                <td>:</td>
                <td>${bastb.pln_receiver_position}</td>
            </tr>
        </table>
    </div>

    <!-- Agreement Text -->
    <div class="section">
        <p style="text-align: justify; text-indent: 50px;">
            Dengan ini menyatakan bahwa PIHAK PERTAMA telah menyerahkan dan PIHAK KEDUA telah menerima
            barang-barang sebagaimana tercantum dalam dokumen berikut:
        </p>
    </div>

    <!-- Document References -->
    <div class="section">
        <div class="section-title">I. REFERENSI DOKUMEN</div>
        <table class="info-table">
            <tr>
                <td>Nomor BAPB</td>
                <td>:</td>
                <td><strong>${bastb.bapb_number}</strong></td>
            </tr>
            <tr>
                <td>Nomor Purchase Order</td>
                <td>:</td>
                <td>${bastb.po_number}</td>
            </tr>
            <tr>
                <td>Nomor Kontrak</td>
                <td>:</td>
                <td>${bastb.contract_number}</td>
            </tr>
            <tr>
                <td>Tanggal Serah Terima</td>
                <td>:</td>
                <td><strong>${formatDate(bastb.handover_date)}</strong></td>
            </tr>
            <tr>
                <td>Lokasi Serah Terima</td>
                <td>:</td>
                <td>${bastb.handover_location}</td>
            </tr>
        </table>
    </div>

    <!-- Items Details -->
    <div class="section">
        <div class="section-title">II. RINCIAN BARANG YANG DISERAHTERIMAKAN</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 5%;">No</th>
                    <th style="width: 35%;">Nama Barang</th>
                    <th style="width: 25%;">Deskripsi</th>
                    <th style="width: 10%;">Satuan</th>
                    <th style="width: 12%;">Qty Disetujui (BAPB)</th>
                    <th style="width: 13%;">Qty Diserahkan</th>
                </tr>
            </thead>
            <tbody>
                ${bastb.items.map((item, index) => `
                <tr>
                    <td class="center">${index + 1}</td>
                    <td>${item.item_name}</td>
                    <td>${item.item_description || '-'}</td>
                    <td class="center">${item.unit_of_measure}</td>
                    <td class="center">${item.approved_quantity}</td>
                    <td class="center"><strong>${item.accepted_quantity}</strong></td>
                </tr>
                ${item.condition_notes ? `
                <tr>
                    <td colspan="6" style="background-color: #e7f3ff; padding: 8px;">
                        <strong>Catatan:</strong> ${item.condition_notes}
                    </td>
                </tr>
                ` : ''}
                `).join('')}
            </tbody>
        </table>
    </div>

    <!-- Declaration -->
    <div class="declaration-box">
        <p style="text-align: justify; margin: 0;">
            <strong>PERNYATAAN:</strong> Dengan ditandatanganinya Berita Acara Serah Terima Barang ini,
            PIHAK KEDUA menyatakan telah menerima barang-barang tersebut di atas dalam kondisi baik,
            sesuai dengan spesifikasi yang telah ditetapkan, dan telah lulus pemeriksaan sebagaimana
            tertuang dalam BAPB Nomor ${bastb.bapb_number}.
        </p>
    </div>

    <!-- Handover Notes -->
    ${bastb.handover_notes ? `
    <div class="notes">
        <div class="notes-title">CATATAN SERAH TERIMA:</div>
        <p>${bastb.handover_notes}</p>
    </div>
    ` : ''}

    <!-- Summary -->
    <div class="section">
        <div class="section-title">III. KESIMPULAN</div>
        <p style="text-align: justify;">
            Total barang yang diserahterimakan adalah sebanyak
            <strong>${bastb.items.reduce((sum, item) => sum + item.accepted_quantity, 0)}</strong>
            ${bastb.items[0]?.unit_of_measure || 'unit'} yang terdiri dari
            <strong>${bastb.items.length}</strong> jenis item.
        </p>
        <p style="text-align: justify;">
            Serah terima barang dilakukan di lokasi <strong>${bastb.handover_location}</strong>
            dan barang telah ditempatkan sesuai dengan prosedur yang berlaku.
        </p>
    </div>

    <!-- Signatures -->
    <div class="signature-section">
        <p style="font-weight: bold; margin-bottom: 20px;">
            Demikian Berita Acara Serah Terima Barang ini dibuat dengan sebenarnya untuk dapat
            dipergunakan sebagaimana mestinya.
        </p>

        <table class="signature-table">
            <tr>
                <td>
                    <div><strong>PIHAK PERTAMA</strong></div>
                    <div style="margin-top: 10px;">(Vendor/Pemasok)</div>
                    <div style="margin-top: 10px; font-style: italic;">Yang Menyerahkan</div>
                    ${bastb.signatures?.vendor_maker ? `
                    <div style="margin-top: 10px; margin-bottom: 10px;">
                        <img src="${bastb.signatures.vendor_maker.signature_data}"
                             alt="Signature"
                             style="max-width: 150px; height: auto;" />
                    </div>
                    <div class="signature-box">
                        <div class="signature-name">${bastb.signatures.vendor_maker.name}</div>
                        <div class="signature-position">${bastb.signatures.vendor_maker.position}</div>
                        <div style="font-size: 9pt; margin-top: 5px;">Tanggal: ${formatDate(bastb.signatures.vendor_maker.signed_at)}</div>
                    </div>
                    ` : `
                    <div class="signature-box">
                        <div class="signature-name">${bastb.vendor_representative}</div>
                        <div class="signature-position">${bastb.vendor_representative_position}</div>
                    </div>
                    `}
                </td>
                <td>
                    <div><strong>PIHAK KEDUA</strong></div>
                    <div style="margin-top: 10px;">(PT PLN Indonesia Power)</div>
                    <div style="margin-top: 10px; font-style: italic;">Yang Menerima</div>
                    ${bastb.signatures?.pln_receiver ? `
                    <div style="margin-top: 10px; margin-bottom: 10px;">
                        <img src="${bastb.signatures.pln_receiver.signature_data}"
                             alt="Signature"
                             style="max-width: 150px; height: auto;" />
                    </div>
                    <div class="signature-box">
                        <div class="signature-name">${bastb.signatures.pln_receiver.name}</div>
                        <div class="signature-position">${bastb.signatures.pln_receiver.position}</div>
                        <div style="font-size: 9pt; margin-top: 5px;">Tanggal: ${formatDate(bastb.signatures.pln_receiver.signed_at)}</div>
                    </div>
                    ` : `
                    <div class="signature-box">
                        <div class="signature-name">${bastb.pln_receiver}</div>
                        <div class="signature-position">${bastb.pln_receiver_position}</div>
                    </div>
                    `}
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Dokumen ini dibuat secara elektronik melalui Sistem APBA PT PLN Indonesia Power</p>
        <p>Nomor: ${bastb.bastb_number} | Dibuat: ${formatDate(bastb.created_at || bastb.handover_date)}</p>
    </div>
</body>
</html>
  `;
};

/**
 * Download document as HTML file
 */
export const downloadDocument = (html: string, filename: string) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
