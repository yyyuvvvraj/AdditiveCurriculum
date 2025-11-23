// scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config(); // fallback to .env

const prisma = new PrismaClient();

// Read EXCEL_PATH from env and validate (this narrowing avoids TS error)
const EXCEL_PATH = process.env.EXCEL_PATH;
if (!EXCEL_PATH) {
  throw new Error('EXCEL_PATH is not defined in .env.local (set EXCEL_PATH="path/to/dashboarddata.xlsx")');
}
const excelPath: string = EXCEL_PATH; // now typed as string for TS

async function main() {
  console.log('Reading Excel file from:', excelPath);

  let wb;
  try {
    wb = xlsx.readFile(excelPath);
  } catch (err) {
    console.error('Failed to open Excel file at', excelPath);
    console.error(err);
    process.exit(1);
  }

  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows: any[] = xlsx.utils.sheet_to_json(sheet, { defval: null });

  console.log('Rows found:', rows.length);

  for (const r of rows) {
    const partId = r['Part_ID'] || r['PartId'] || r['Part ID'];
    if (!partId) continue;

    const partName = r['Part_Name'] || r['Part Name'] || null;
    const category = r['Category'] || null;
    const currentStock = Number(r['Current_Stock'] ?? r['Current Stock'] ?? 0);
    const rop = r['ROP'] !== undefined && r['ROP'] !== null ? Number(r['ROP']) : null;
    const warningLevel =
      r['Warning_Level'] !== undefined && r['Warning_Level'] !== null
        ? Number(r['Warning_Level'])
        : null;
    const vendor = r['Vendor'] || null;
    const leadTimeDay =
      r['Lead_Time_Day'] !== undefined && r['Lead_Time_Day'] !== null
        ? Number(r['Lead_Time_Day'])
        : null;
    const lastUpdatedRaw = r['Last_Updated'] || r['Last Updated'] || null;
    const lastUpdated = lastUpdatedRaw ? new Date(lastUpdatedRaw) : new Date();

    // Upsert Part snapshot
    const up = await prisma.part.upsert({
      where: { partId },
      update: {
        partName,
        category,
        currentStock,
        rop,
        warningLevel,
        vendor,
        leadTimeDay,
        lastUpdated,
      },
      create: {
        partId,
        partName,
        category,
        currentStock,
        rop,
        warningLevel,
        vendor,
        leadTimeDay,
        lastUpdated,
      },
    });

    // Create PartHistory using relation connect
    await prisma.partHistory.create({
      data: {
        part: { connect: { id: up.id } },
        stock: currentStock,
        changeAt: lastUpdated,
        note: 'seeded',
      },
    });
  }

  console.log('✅ Seeding finished.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
