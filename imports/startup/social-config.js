import { ServiceConfiguration } from 'meteor/service-configuration'

ServiceConfiguration.configurations.remove({
  service: 'facebook'
})

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: '607481689447238',
  secret: '4af14b30573170d0326a180f72997901',
})
