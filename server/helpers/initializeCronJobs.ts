import { schedule } from 'node-cron'
import knex from '../database/connection'
import * as dayjs from 'dayjs'

async function expireUrls() {
  console.log('expiring urls')
  await knex.from('urls').update({ active: false }).where('expiresAt', '<', dayjs().toDate())
}

export default function initializeCronJobs() {
  schedule('* * * * *', expireUrls)
}