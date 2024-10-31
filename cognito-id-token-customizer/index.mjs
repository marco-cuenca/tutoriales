import axios from 'axios';

export const handler = async (event) => {
  const userAttributes = event.request.userAttributes;

  const data = new URLSearchParams({
    client_id: "9b8b93cb-3e18-44ef-a041-12bdd0c8b92d",
    client_secret: "aj28Q~KK6gQq2IzLv2_Rwf5Tz2J6_LpuRfIxmbM6",
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  });

  const configLogin = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const login = await axios.post("https://login.microsoftonline.com/be99e360-0df5-4c08-981b-f90011363e16/oauth2/v2.0/token", data, configLogin);

  const configGetData = {
    headers: {
      'Authorization': `Bearer ${login.data.access_token}`
    }
  };

  const userMicrosoft = await axios.get(`https://graph.microsoft.com/v1.0/users/${userAttributes.name}?$select=onPremisesExtensionAttributes&`, configGetData);

  event.response = {
    claimsOverrideDetails: {
        claimsToAddOrOverride: {
          ...userAttributes,
          document_number: userMicrosoft.data.onPremisesExtensionAttributes.extensionAttribute1,
        },
    },
  };

  return event;
};
