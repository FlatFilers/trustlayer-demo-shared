import { Flatfile } from "@flatfile/api";

export const projects_sheet: Flatfile.SheetConfig = {
  name: "Projects",
  slug: "projects_sheet",
  fields: [
    {
      key: "project_name",
      label: "Project Name",
      type: "string",
      constraints: [
        {
          type: "required",
        },
      ],
    },
    {
      key: "description",
      label: "Description",
      type: "string",
    },
    {
      key: "start_date",
      label: "Start Date",
      type: "string",
    },
    {
      key: "end_date",
      label: "End Date",
      type: "string",
    },
  ],
  actions: [
    {
      operation: "auto-fix",
      mode: "background",
      label: "Autofix",
      primary: true,
    },
  ],
};

export const parties_sheet: Flatfile.SheetConfig = {
  name: "Parties",
  slug: "parties_sheet",
  fields: [
    {
      key: "business_name",
      label: "Business Name",
      type: "string",
      constraints: [
        {
          type: "required",
        },
      ],
    },
    {
      key: "type",
      label: "Type",
      type: "enum",
      constraints: [
        {
          type: "required",
        },
      ],
      config: {
        options: [
          { label: "Project Manager", value: "projectManager" },
          { label: "General Contractor", value: "generalContractor" },
          { label: "Electrical Contractor", value: "electricalContractor" },
          { label: "Plumbing Contractor", value: "plumbingContractor" },
          { label: "HVAC Contractor", value: "hvacContractor" },
        ],
      },
    },
    {
      key: "contact_person_name",
      label: "Contact Person Name",
      type: "string",
    },
    {
      key: "contact_person_email",
      label: "Contact Person Email",
      type: "string",
    },
    {
      key: "contact_person_phone",
      label: "Contact Person Phone",
      type: "string",
    },
    {
      key: "address_street_city_state",
      label: "Address (Street, City, State...)",
      type: "string",
    },
    {
      key: "suite_floor_unit",
      label: "Suite, Floor, Unit...",
      type: "string",
    },
    {
      key: "website",
      label: "Website",
      type: "string",
    },
    {
      key: "additional_notes",
      label: "Additional Notes",
      type: "string",
    },
    {
      key: "tag_1",
      label: "Tag 1",
      type: "string",
    },
    {
      key: "tag_2",
      label: "Tag 2",
      type: "string",
    },
    {
      key: "tag_3",
      label: "Tag 3",
      type: "string",
    },
    {
      key: "tag_4",
      label: "Tag 4",
      type: "string",
    },
    {
      key: "tag_5",
      label: "Tag 5",
      type: "string",
    },
  ],
  actions: [
    {
      operation: "auto-fix",
      mode: "background",
      label: "Autofix",
      primary: true,
    },
  ],
};
