import 'server-only'

import { createWeb3FormsNotifier } from './web3forms'

const sendWithWeb3Forms = createWeb3FormsNotifier({
  accessKey: process.env.WEB3FORMS_ACCESS_KEY,
})

export const sendEnquiryNotification = sendWithWeb3Forms
