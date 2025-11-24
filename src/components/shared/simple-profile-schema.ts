import { z } from "zod";

const INDIVIDUAL_RELATIONSHIP_TYPES = [
  "Client",
  "Lead",
  "Manager",
  "Coworker",
  "Direct Report",
  "Friend",
  "Family",
  "Service Provider",
  "Agency Contact",
  "Other",
] as const;

const GROUP_RELATIONSHIP_TYPES = [
  "Client Company",
  "Prospect Company",
  "Partner Organization",
  "Vendor / Supplier",
  "Agency",
  "Contractor Team",
  "Internal Team",
  "Project Team",
  "Leadership Team",
  "Study Group",
  "School Organization",
  "Friend Group",
  "Family Group",
  "Social Circle",
  "Community Group",
  "Hobby Group",
  "Volunteer Group",
  "Household",
] as const;

export const simpleProfileSchema = z
  .object({
    profileType: z.enum(["Individual", "Group"]),
    name: z.string().min(1, "Name is required"),
    relationshipType: z.string(),
    formality: z.enum(["Formal", "Neutral", "Casual"]),
    friendliness: z.enum(["Friendly", "Neutral", "Reserved"]),
    preferredLength: z.enum(["Short", "Medium", "Long"]),
    emojiUsage: z.enum(["None", "Minimal", "Allowed"]),
    tags: z.array(z.string()),
  groupMembers: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        role: z.string().optional(),
        email: z
          .union([z.string().email("Invalid email address"), z.literal("")])
          .optional(),
      })
    )
    .optional(),
  })
  .refine(
    (data) => {
      if (data.profileType === "Individual") {
        return INDIVIDUAL_RELATIONSHIP_TYPES.includes(
          data.relationshipType as (typeof INDIVIDUAL_RELATIONSHIP_TYPES)[number]
        );
      } else {
        return GROUP_RELATIONSHIP_TYPES.includes(
          data.relationshipType as (typeof GROUP_RELATIONSHIP_TYPES)[number]
        );
      }
    },
    {
      message: "Invalid relationship type for selected profile type",
      path: ["relationshipType"],
    }
  );

export type SimpleProfileFormData = z.infer<typeof simpleProfileSchema>;

export { INDIVIDUAL_RELATIONSHIP_TYPES, GROUP_RELATIONSHIP_TYPES };

