import api from "@flatfile/api";
import { jobHandler } from "@flatfile/plugin-job-handler";
import { Simplified } from "@flatfile/util-common";
import * as chrono from "chrono-node";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
    parsePhoneNumber,
    isValidPhoneNumber,
    CountryCode,
    NumberFormat,
    FormatNumberOptions,
  } from 'libphonenumber-js'

export default jobHandler("sheet:auto-fix", async ({ context }, tick) => {
  const { jobId, sheetId } = context;

  try {
    const updates = [];
    const delete_ids = [];

    const records = await Simplified.getAllRecords(sheetId);

    records.forEach((record) => {
      const newRecord: Record<string, any> = { _id: record._id };
      let updateRecord = false;
      const startDate = record.start_date as string;
      const endDate = record.end_date as string;
      const phone = record.contact_person_phone as string;

      if (startDate) {
        const normalizedDate = normalizeDate(startDate);
        if (normalizedDate) {
          newRecord["start_date"] = normalizedDate;
          updateRecord = true;
        }
      }
      if (endDate) {
        const normalizedDate = normalizeDate(endDate);
        if (normalizedDate) {
          newRecord["end_date"] = normalizedDate;
          updateRecord = true;
        }
      }

      if (phone) {
        const phoneNumber = parsePhoneNumber(phone, "US")
        const formattedPhone = phoneNumber.format('NATIONAL') as string
        if (phone != formattedPhone) {
            newRecord["contact_person_phone"] = formattedPhone;
            updateRecord = true;
        }
      }

      if (updateRecord) {
        updates.push(newRecord);
      }
    });
    await Simplified.updateAllRecords(sheetId, updates as any);
    if (delete_ids.length > 0) {
      await api.records.delete(sheetId, { ids: delete_ids });
    }
    await api.jobs.complete(jobId, { info: "Completed processing records" });
  } catch (error) {
    await api.jobs.fail(jobId, { info: "Failed processing records" });
  }
});

export interface DateFormatNormalizerConfig {
  sheetSlug?: string;
  dateFields: string[];
  outputFormat: string;
  includeTime: boolean;
  locale?: string;
}

export function normalizeDate(dateString: string): string | null {
  try {
    const parsedDate = chrono.parseDate(dateString);
    if (parsedDate) {
      const formattedDate = format(parsedDate, "MM/dd/yyyy", {
        locale: enUS,
      });

      // If time should not be included, truncate the formatted date to just the date part
      return formattedDate.split(" ")[0];
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
