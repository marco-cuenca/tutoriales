import axios from 'axios';

export const handler = async (event) => {
  const userAttributes = event.request.userAttributes;

  const data = new URLSearchParams({
    client_id: "client_id_app_entraid",
    client_secret: "client_secret_app_entraid",
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  });

  const configLogin = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  const login = await axios.post("https://login.microsoftonline.com/aca-va-el-id-del-tenant-del-app-entraid/oauth2/v2.0/token", data, configLogin);

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
