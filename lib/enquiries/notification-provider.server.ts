import 'server-only'

import { createWeb3FormsNotifier } from './web3forms'

const sendWithWeb3Forms = createWeb3FormsNotifier({
  accessKey: process.env.WEB3FORMS_ACCESS_KEY,
  ccEmail: process.env.CONTACT_TO_EMAIL,
})

export const sendEnquiryNotification = sendWithWeb3Forms
