import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Note: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.owner()]), // each user can only see their own notes
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
