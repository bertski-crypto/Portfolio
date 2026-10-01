/**
 * Verified certifications.
 *
 * Import the PDF directly so Vite handles it as an asset.
 * The file will be copied to dist/assets/ and the import returns the public URL.
 */
import certificatePdf from '../certificates/certificate.pdf';

export const certifications = [
  {
    id: 'python-essentials-1',
    name: 'PYTHON ESSENTIALS 1',
    recipient: 'Albert Beato',
    provider: 'DICT-ITU DTC Initiative',
    program: 'Cisco Networking Academy',
    completedOn: '2026-09-28',
    completedLabel: 'September 28, 2026',
    instructor: 'Morga Aljhune',
    credentialId: '0d4f1801-3d19-4a2c-8502-9813175d9a42',
    description:
      'Completed Python Essentials 1 through the DICT-ITU DTC Initiative and Cisco Networking Academy.',
    file: certificatePdf,
    fileName: 'python-essentials-1.pdf',
  },
];

export const getVerifiedCertifications = () => certifications;