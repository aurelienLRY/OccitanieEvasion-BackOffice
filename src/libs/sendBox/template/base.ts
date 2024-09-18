import React from "react";


/**
 * Header email
 * @param title 
 * @returns STRING
 */
const header = (title: string): string => {
  return `
  <tr id="header" style="margin-bottom: 10px; background-color: #082f49;">
  <td
    style="
      width: 100%;
      padding: 20px;
      border-radius: 0.5rem;
      margin-bottom: 10px;
    "
  >
    <h1
      style="
        margin: 0;
        color: #ffffff;
        text-align: center;
        font-size: 1.5rem;
      "
      >
      ${title}
      </h1>
      </td>
      </tr>
  `;
};

/**
 * Footer email
 * @returns STRING
 */
const footer = (): string => {
  return `
  <tr
              id="footer"
              style="
                width: 100%;
                background-color: #082f49;
                padding: 20px;
                border-radius: 0.5rem;
                margin-bottom: 10px;
                text-align: center;
              "
            >
              <td
                style="
                width: 100%;
                background-color: #082f49;
                padding: 20px;
                border-radius: 0.5rem;
                margin-bottom: 10px;
                text-align: center;
              ">
                <p
                  style="
                    font-weight: bold;
                    padding-bottom: 0.1rem;
                    color: #ffffff;
                    text-align: center;
                  "
                >
                  Occitanie évasion
                </p>

                <div>
                  <a
                    href="mailto:contact@occitanie-evasion.fr"
                    style="color: #fff; text-decoration: none;"
                  >
                    contact@occitanie-evasion.fr
                  </a>
                  &nbsp;|&nbsp;
                  <a
                    href="tel:06 00 00 00 00"
                    style="color: #fff; text-decoration: none;"
                  >
                    06 00 00 00 00
                  </a>
                </div>

                  <p style="font-size: 0.5rem; color: #ffffff;">
                    © 2023-2024 Occitanie évasion | Tous droits réservés.
                  </p>
              </td>
            </tr>
  `;
};

/**
 * Content email
 * @param title 
 * @param children 
 * @returns STRING
 */
export const MailContent = ( title: string, children: string ): string => {
return `
  <table
    style="width: 100%; background-color: #1f2937;"
    role="presentation"
    cellspacing="0"
    cellpadding="0"
    border="0"
    >
    ${header(title)}

    <tr id="body" style="margin-bottom: 10px; background-color: #1f2937; padding: 20px;">
    <td style="width: 100%; padding: 20px;">
      ${children} 
      <p style="margin: 0; color: #ffffff; text-align: center;">Cordialement,</p>
      <p style="margin: 0; color: #ffffff; text-align: center;">Florent.</p>
    </td>
    </tr>

      ${footer()}
  </table>
  `;
};

/**
 * Html base
 * @param title 
 * @param children 
 * @returns STRING
 */
export const HtmlBase = (title: string, children: string): string => {
  return `
<!DOCTYPE html>
<html lang="fr" style="width: 100%; margin: 0; padding: 0; background-color: #1f2937; color: #ffffff; font-size: 16px;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
    body {
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: #1f2937;
      color: #ffffff;
    }
      p {
        margin: 0;
      }
    </style>
  </head>
  <body>
  ${MailContent(title, children)}
  </body>
</html>
  `;
};