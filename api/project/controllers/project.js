"use strict";
const { sanitizeEntity } = require("strapi-utils");
const FormData = require("form-data");
const axios = require("axios");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const appCenterToken = "115be81654e37d508a96254a0701f92df01ce8cf";

const gitlabToken = "76a6bb8f203dc239c8ba4af171cc73";
const branch = "master";

module.exports = {
  create: async (ctx) => {
    // Step1 : create app
    const { data: appInfo } = await axios.post(
      "https://api.appcenter.ms/v0.1/apps",
      {
        display_name: ctx.request.body.name,
        os: "Android",
        platform: "React-Native",
      },
      {
        headers: {
          "x-api-token": appCenterToken,
        },
      }
    );

    // Step2 : create token
    const { data: appApiToken } = await axios.post(
      `https://api.appcenter.ms/v0.1/apps/${appInfo.owner.name}/${appInfo.name}/api_tokens`,
      {
        description: appInfo.name,
        scope: ["all"],
      },
      {
        headers: {
          "x-api-token": appCenterToken,
        },
      }
    );

    // Step3: add member
    try {
      // await axios.post(
      //   `https://api.appcenter.ms/v0.1/apps/${appInfo.owner.name}/${appInfo.name}/invitations`,
      //   {
      //     user_email: "mrluyx@gmail.com",
      //     role: "admin",
      //   },
      //   {
      //     headers: {
      //       "x-api-token": appCenterToken,
      //     },
      //   }
      // );
    } catch (e) {
      console.log("Error invite");
    }

    const body = { ...ctx.request.body, appApiToken, appInfo };

    let entity = await strapi.services.project.create(body);

    return sanitizeEntity(entity, { model: strapi.models.project });
  },

  publish: async (ctx) => {
    const { id } = ctx.params;

    let entity = await strapi.services.project.findOne({ id });

    var data = new FormData();
    data.append("variables[APPCENTER_API_TOKEN]", appCenterToken);
    data.append("variables[OWNER_NAME]", entity.appInfo.owner.name);
    data.append("variables[APP_NAME]", entity.appInfo.name);
    data.append("variables[APP_ID]", id);
    data.append("ref", branch);
    data.append("token", gitlabToken);

    const config = {
      method: "post",
      url: "https://gitlab.com/api/v4/projects/19365418/trigger/pipeline",
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };

    await axios(config)
      .then(function (response) {
        console.log("Call Trigger Build Git Lab - Done");
      })
      .catch(function (error) {
        console.log(error);
      });

    ctx.send('Ok')
  },
};
