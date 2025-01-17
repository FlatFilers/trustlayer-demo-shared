import FlatfileListener, { FlatfileEvent } from "@flatfile/listener";
import { configureSpace } from "@flatfile/plugin-space-configure";
import { jobHandler } from "@flatfile/plugin-job-handler";
import { projects_sheet, parties_sheet } from "./blueprint";
import autoFix from "./autoFix";
import { FlatfileRecord, bulkRecordHook } from "@flatfile/plugin-record-hook";
import { validateEmail } from "@flatfile/plugin-validate-email";

export default function (listener: FlatfileListener) {
  listener.use(
    configureSpace({
      workbooks: [
        {
          name: "TrustLayer Workbook",
          sheets: [projects_sheet, parties_sheet],
          actions: [
            {
              operation: "submitActionBg",
              mode: "background",
              label: "Submit",
              primary: true,
            },
          ],
        },
      ],
      space: {
        metadata: {
          theme: {
            root: {
              primaryColor: "#2064dc",
              actionColor: "#2064dc",
            },
            sidebar: {
              logo: "https://trustlayer.io/_next/image?url=https%3A%2F%2Ftrustlayer-website.nyc3.digitaloceanspaces.com%2Fmedia%2F12b77db215216b09db0c1d70d00216d3.png&w=3840&q=75",
            },
          },
        },
      },
    })
  );

  listener.use(
    jobHandler("workbook:submitActionBg", async (event, tick) => {
      console.log(event);
    })
  );

  listener.use(autoFix);

  listener.use(
    validateEmail({
      emailFields: ["contact_person_email"],
      errorMessages: {
        invalid: "The email address is not valid",
      },
    })
  );

  listener.use(
    bulkRecordHook("projects_sheet", (records: FlatfileRecord[]) => {
      records.map((record) => {
        const startDate = record.get("start_date") as string;
        const endDate = record.get("end_date") as string;

        const dateRegex = /(0\d{1}|1[0-2])\/([0-2]\d{1}|3[0-1])\/(19|20)\d{2}/;

        if (startDate) {
          if (!dateRegex.test(startDate)) {
            record.addError("start_date", `Dates must be in MM/DD/YYYY format`);
          }
        }
        if (endDate) {
          if (!dateRegex.test(endDate)) {
            record.addError("end_date", `Dates must be in MM/DD/YYYY format`);
          }
        }

        return record;
      });
    })
  );

  listener.use(
    bulkRecordHook("parties_sheet", (records: FlatfileRecord[]) => {
      records.map((record) => {
        const phone = record.get("contact_person_phone") as string;

        const phoneRegex = /\(\d{3}\)\s\d{3}-\d{4}/;

        if (phone) {
          // validate phone number with area code
          if (!phoneRegex.test(phone)) {
            record.addError(
              "contact_person_phone",
              "Phone number must be in the format (###) ###-####"
            );
          }
        }

        return record;
      });
    })
  );

  // listener.use(checkCompliance)
  // -- grab the currently filtered records
  // -- stream to checking service? generate a file?

  // listener.use(tagAtMapping)
  // -- listen for mapping job
  // -- when mapping job is complete, add metadata to record that has file name
  // -- { sourceFileName: things.csv }

  // listener.use(customdedupe)
  // -- when mapping job is complete and file tagging is complete
  // -- compare keys and metadata on files to determine duplicates
  // -- follow algorithm to either auto-delete dupes or flag dupes as error

  // listener.use(egress)
  // -- grab all of the records on the sheet in flatfile
  // -- push to your API (pass in auth from secrets)
  // -- return a callback to Flatfile
  // -- update metadata on the record to say "loaded"
}
