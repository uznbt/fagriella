import { COURSES_SHEET_URL, MATERIALS_SHEET_URL, ASSIGNMENTS_SHEET_URL, ARSIP_FOTO_SHEET_URL, MAHASISWA_SHEET_URL } from '../config';

/**
 * Robust CSV parser for multiline and quoted fields
 */
export function parseCSV(csvText) {
    if (!csvText || csvText.trim() === '') return [];
    if (csvText.trim().toLowerCase().startsWith('<')) return [];

    const rows = [];
    let currentRow = [];
    let currentVal = '';
    let inQuote = false;

    // Strip BOM and normalize line endings
    csvText = csvText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                currentVal += '"';
                i++;
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            currentRow.push(currentVal);
            currentVal = '';
        } else if (char === '\n' && !inQuote) {
            currentRow.push(currentVal);
            rows.push(currentRow);
            currentRow = [];
            currentVal = '';
        } else {
            currentVal += char;
        }
    }
    if (currentRow.length > 0 || currentVal) {
        currentRow.push(currentVal);
        rows.push(currentRow);
    }

    if (rows.length === 0) return [];

    const headers = rows[0].map(h => h.trim().replace(/^"|"$/g, '').replace(/[\u200B-\u200D\uFEFF]/g, ''));
    return rows.slice(1).filter(row => row.length >= headers.length && row.slice(0, headers.length).some(col => col && col.trim() !== '')).map(values => {
        const row = {};
        headers.forEach((header, index) => {
            let val = (values[index] || '').replace(/^"|"$/g, '').trim().replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g, '');
            row[header] = val.replace(/\\n/g, '\n');
        });
        return row;
    });
}

/**
 * Fetch all required data from Google Sheets
 */
export async function fetchAppData() {
    try {
        const [coursesRes, materialsRes, assignmentsRes, arsipFotoRes, mahasiswaRes] = await Promise.all([
            fetch(COURSES_SHEET_URL).then(r => r.ok ? r.text() : ''),
            fetch(MATERIALS_SHEET_URL).then(r => r.ok ? r.text() : ''),
            fetch(ASSIGNMENTS_SHEET_URL).then(r => r.ok ? r.text() : ''),
            fetch(ARSIP_FOTO_SHEET_URL).then(r => r.ok ? r.text() : ''),
            fetch(MAHASISWA_SHEET_URL).then(r => r.ok ? r.text() : '')
        ]);

        return {
            courses: parseCSV(coursesRes),
            materials: parseCSV(materialsRes),
            assignments: parseCSV(assignmentsRes),
            arsipFoto: parseCSV(arsipFotoRes),
            mahasiswa: parseCSV(mahasiswaRes)
        };
    } catch (error) {
        console.error("Error fetching app data:", error);
        throw error;
    }
}
